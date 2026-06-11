<template>
  <div class="editor-container">
    <textarea ref="textareaRef"></textarea>
    <div class="remote-cursors-layer" ref="cursorsLayerRef"></div>
  </div>
</template>

<script setup lang="ts">
import type CodeMirror from 'codemirror'
import type { CursorPosition, UserCursor } from '../composables/useCollaboration'

const props = defineProps<{
  modelValue: string
  documentId: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const cursorsLayerRef = ref<HTMLDivElement | null>(null)
let editor: CodeMirror.Editor | null = null
let isLocalChange = true
let cursorUpdateTimeout: ReturnType<typeof setTimeout> | null = null

const { localContent, isRemoteUpdate, sendEdit, sendCursor, remoteCursors, setLocalContent } = useCollaboration()

const cursorMarkers = ref<Map<string, { lineWidget: any; marker: any }>>(new Map())

watch(localContent, (newContent) => {
  if (editor && isRemoteUpdate.value && newContent !== editor.getValue()) {
    isLocalChange = false
    const cursor = editor.getCursor()
    const scrollInfo = editor.getScrollInfo()
    editor.setValue(newContent)
    editor.setCursor(cursor)
    editor.scrollTo(scrollInfo.left, scrollInfo.top)
    emit('update:modelValue', newContent)
    isLocalChange = true
  }
})

watch(remoteCursors, () => {
  updateRemoteCursors()
}, { deep: true })

watch(() => props.documentId, () => {
  if (editor) {
    isLocalChange = false
    editor.setValue(props.modelValue)
    setLocalContent(props.modelValue)
    editor.clearHistory()
    clearAllRemoteCursors()
    isLocalChange = true
  }
})

onMounted(async () => {
  if (!textareaRef.value || !process.client) return

  await import('codemirror/lib/codemirror.css')
  await import('codemirror/theme/monokai.css')
  const CodeMirror = (await import('codemirror')).default
  await import('codemirror/mode/markdown/markdown')
  await import('codemirror/addon/edit/continuelist')

  editor = CodeMirror.fromTextArea(textareaRef.value, {
    mode: 'markdown',
    theme: 'default',
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    autofocus: false,
    extraKeys: {
      'Enter': 'newlineAndIndentContinueMarkdownList'
    }
  })

  editor.setValue(props.modelValue)
  setLocalContent(props.modelValue)

  editor.on('change', () => {
    if (!editor || !isLocalChange) return
    const value = editor.getValue()
    emit('update:modelValue', value)
    emit('change', value)

    if (props.documentId) {
      sendEdit(value, editor.getCursor())
    }
  })

  editor.on('cursorActivity', () => {
    if (!editor || !props.documentId) return

    if (cursorUpdateTimeout) {
      clearTimeout(cursorUpdateTimeout)
    }

    cursorUpdateTimeout = setTimeout(() => {
      if (editor) {
        const cursor = editor.getCursor()
        const selection = editor.listSelections()[0]
        sendCursor({
          line: cursor.line,
          ch: cursor.ch,
          anchor: selection ? { line: selection.anchor.line, ch: selection.anchor.ch } : undefined,
          head: selection ? { line: selection.head.line, ch: selection.head.ch } : undefined
        })
      }
    }, 50)
  })

  editor.on('scroll', () => {
    updateRemoteCursors()
  })

  watch(() => props.modelValue, (newValue) => {
    if (editor && newValue !== editor.getValue() && isLocalChange) {
      editor.setValue(newValue)
      setLocalContent(newValue)
    }
  })
})

onUnmounted(() => {
  if (cursorUpdateTimeout) {
    clearTimeout(cursorUpdateTimeout)
  }
  clearAllRemoteCursors()
  if (editor) {
    editor.toTextArea()
    editor = null
  }
})

function clearAllRemoteCursors() {
  if (!editor) return
  cursorMarkers.value.forEach(({ lineWidget, marker }) => {
    if (lineWidget) lineWidget.clear()
    if (marker) marker.clear()
  })
  cursorMarkers.value.clear()

  if (cursorsLayerRef.value) {
    cursorsLayerRef.value.innerHTML = ''
  }
}

function updateRemoteCursors() {
  if (!editor || !cursorsLayerRef.value) return

  const scrollInfo = editor.getScrollInfo()
  const cursorsLayer = cursorsLayerRef.value
  cursorsLayer.innerHTML = ''

  remoteCursors.value.forEach((cursorInfo: UserCursor, uid: string) => {
    const existing = cursorMarkers.value.get(uid)
    if (existing && existing.marker) {
      existing.marker.clear()
    }
    if (existing && existing.lineWidget) {
      existing.lineWidget.clear()
    }

    if (!cursorInfo.position) return

    const pos = {
      line: cursorInfo.position.line,
      ch: cursorInfo.position.ch
    }

    const coords = editor.charCoords(pos, 'local')
    if (!coords) return

    const cursorEl = document.createElement('div')
    cursorEl.className = 'remote-cursor'
    cursorEl.style.position = 'absolute'
    cursorEl.style.left = `${coords.left - scrollInfo.left}px`
    cursorEl.style.top = `${coords.top - scrollInfo.top}px`
    cursorEl.style.height = `${coords.bottom - coords.top}px`
    cursorEl.style.width = '2px'
    cursorEl.style.backgroundColor = cursorInfo.color
    cursorEl.style.pointerEvents = 'none'
    cursorEl.style.zIndex = '10'
    cursorEl.style.transition = 'left 0.05s, top 0.05s'

    const labelEl = document.createElement('div')
    labelEl.className = 'remote-cursor-label'
    labelEl.style.position = 'absolute'
    labelEl.style.top = '-20px'
    labelEl.style.left = '0'
    labelEl.style.backgroundColor = cursorInfo.color
    labelEl.style.color = '#fff'
    labelEl.style.fontSize = '10px'
    labelEl.style.padding = '2px 6px'
    labelEl.style.borderRadius = '3px 3px 3px 0'
    labelEl.style.whiteSpace = 'nowrap'
    labelEl.style.opacity = '0.9'
    labelEl.style.fontWeight = '500'
    labelEl.textContent = uid.slice(-6)

    cursorEl.appendChild(labelEl)
    cursorsLayer.appendChild(cursorEl)

    if (cursorInfo.position.anchor && cursorInfo.position.head) {
      const anchorPos = {
        line: cursorInfo.position.anchor.line,
        ch: cursorInfo.position.anchor.ch
      }
      const headPos = {
        line: cursorInfo.position.head.line,
        ch: cursorInfo.position.head.ch
      }

      const from = (anchorPos.line < headPos.line || (anchorPos.line === headPos.line && anchorPos.ch < headPos.ch))
        ? anchorPos : headPos
      const to = (anchorPos.line > headPos.line || (anchorPos.line === headPos.line && anchorPos.ch > headPos.ch))
        ? anchorPos : headPos

      if (from.line !== to.line || from.ch !== to.ch) {
        try {
          const marker = editor.markText(from, to, {
            className: 'remote-selection',
            css: `background-color: ${cursorInfo.color}33; border-left: 1px solid ${cursorInfo.color}; border-right: 1px solid ${cursorInfo.color};`
          })

          cursorMarkers.value.set(uid, {
            lineWidget: null,
            marker
          })
        } catch (e) {
          console.warn('Failed to mark selection:', e)
        }
      }
    }
  })
}

function getEditor(): CodeMirror.Editor | null {
  return editor
}

defineExpose({
  getEditor,
  updateRemoteCursors
})
</script>

<style scoped>
.editor-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.editor-container :deep(.CodeMirror) {
  height: 100%;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.editor-container :deep(.CodeMirror-gutters) {
  background: #f7f7f7;
  border-right: 1px solid #e0e0e0;
}

.editor-container :deep(.CodeMirror-linenumber) {
  color: #999;
}

.remote-cursors-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.editor-container :deep(.remote-selection) {
  position: relative;
  z-index: 5;
}

.remote-cursor {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

.remote-cursor-label {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
  font-weight: 500;
}
</style>
