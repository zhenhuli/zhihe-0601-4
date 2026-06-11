<template>
  <div class="player-layout">
    <aside class="playlist-sidebar">
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'playlist' }"
          @click="activeTab = 'playlist'"
        >
          <i class="fas fa-list-ul"></i> 播放列表
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          <i class="fas fa-heart"></i> 我的收藏
        </button>
      </div>

      <div class="upload-area">
        <label class="upload-btn">
          <i class="fas fa-plus"></i> 上传本地音乐
          <input
            type="file"
            accept="audio/mp3,audio/mpeg,.mp3"
            multiple
            @change="handleFileUpload"
            hidden
          />
        </label>
      </div>

      <ul v-if="activeTab === 'playlist'" class="song-list">
        <li
          v-for="(song, index) in playlist"
          :key="song.id"
          class="song-item"
          :class="{ active: currentIndex === index }"
          @click="switchSong(index); play()"
        >
          <div class="song-item-index">
            <span v-if="currentIndex === index && isPlaying" class="playing-indicator">
              <span></span><span></span><span></span>
            </span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="song-item-info">
            <div class="song-item-title">{{ song.title }}</div>
            <div class="song-item-artist">{{ song.artist }}</div>
          </div>
          <button
            class="fav-btn-small"
            :class="{ favorited: isFavorite(song.id) }"
            @click.stop="toggleFavorite(song.id)"
            :title="isFavorite(song.id) ? '取消收藏' : '收藏'"
          >
            <i class="fas fa-heart"></i>
          </button>
        </li>
      </ul>

      <ul v-else class="song-list">
        <li v-if="favoriteSongs.length === 0" class="empty-favorites">
          <i class="fas fa-heart-crack"></i>
          <p>还没有收藏的歌曲</p>
          <p class="empty-hint">点击歌曲旁的 ❤ 添加收藏</p>
        </li>
        <li
          v-for="song in favoriteSongs"
          :key="song.id"
          class="song-item"
          :class="{ active: currentSong.id === song.id }"
          @click="switchSong(playlist.findIndex(s => s.id === song.id)); play()"
        >
          <div class="song-item-index">
            <span v-if="currentSong.id === song.id && isPlaying" class="playing-indicator">
              <span></span><span></span><span></span>
            </span>
            <span v-else class="fav-icon-small"><i class="fas fa-heart"></i></span>
          </div>
          <div class="song-item-info">
            <div class="song-item-title">{{ song.title }}</div>
            <div class="song-item-artist">{{ song.artist }}</div>
          </div>
          <button
            class="fav-btn-small favorited"
            @click.stop="toggleFavorite(song.id)"
            title="取消收藏"
          >
            <i class="fas fa-heart"></i>
          </button>
        </li>
      </ul>
    </aside>

    <main class="player-main">
      <div class="cover-area">
        <div class="cover-wrapper" :class="{ spinning: isPlaying }">
          <img :src="currentSong.cover" :alt="currentSong.title" class="cover-img" />
        </div>
      </div>

      <div class="visualizer-area">
        <div
          v-for="(value, index) in visualizerBars"
          :key="index"
          class="visualizer-bar"
          :class="{ 'real': hasRealVisualizer }"
          :style="{ height: value + '%' }"
        ></div>
      </div>
      <div class="visualizer-hint" v-if="!hasRealVisualizer && isPlaying">
        <i class="fas fa-info-circle"></i>
        <span>上传本地音乐可获得真实频谱效果</span>
      </div>

      <div class="song-info">
        <div class="song-info-row">
          <div class="song-info-text">
            <h1 class="song-title">{{ currentSong.title }}</h1>
            <p class="song-artist">{{ currentSong.artist }}</p>
          </div>
          <button
            class="fav-btn"
            :class="{ favorited: isFavorite(currentSong.id) }"
            @click="toggleFavorite(currentSong.id)"
            :title="isFavorite(currentSong.id) ? '取消收藏' : '我喜欢'"
          >
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>

      <div class="progress-area">
        <span class="time-label">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" ref="progressBarRef" @click="onProgressClick">
          <div class="progress-filled" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
        </div>
        <span class="time-label">{{ formatTime(duration) }}</span>
      </div>

      <div class="controls">
        <button
          class="ctrl-btn mode-btn"
          :class="{ active: playMode !== 'sequential' }"
          @click="togglePlayMode"
          :title="playModeLabel"
        >
          <i class="fas" :class="playModeIcon"></i>
          <span v-if="playMode === 'loop'" class="mode-badge">1</span>
        </button>
        <button class="ctrl-btn" @click="prev" title="上一首">
          <i class="fas fa-backward-step"></i>
        </button>
        <button class="ctrl-btn play-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button class="ctrl-btn" @click="next" title="下一首">
          <i class="fas fa-forward-step"></i>
        </button>
        <button class="ctrl-btn mode-btn" style="visibility: hidden">
          <i class="fas fa-repeat"></i>
        </button>
      </div>

      <div class="play-mode-label" v-if="playMode !== 'sequential'">
        {{ playModeLabel }}
      </div>

      <div class="volume-area">
        <i class="fas" :class="volumeIcon" @click="toggleMute"></i>
        <div class="volume-bar" ref="volumeBarRef" @click="onVolumeClick">
          <div class="volume-filled" :style="{ width: volume * 100 + '%' }"></div>
          <div class="volume-thumb" :style="{ left: volume * 100 + '%' }"></div>
        </div>
        <span class="volume-value">{{ Math.round(volume * 100) }}%</span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const {
  playlist,
  currentSong,
  currentIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  playMode,
  playModeIcon,
  playModeLabel,
  togglePlayMode,
  favorites,
  favoriteSongs,
  isFavorite,
  toggleFavorite,
  togglePlay,
  play,
  next,
  prev,
  seek,
  setVolume,
  switchSong,
  formatTime,
  initAudio,
  restoreState,
  updateFrequencyData,
  addSong,
  hasRealVisualizer,
} = useMusicPlayer()

const progressBarRef = ref<HTMLElement | null>(null)
const volumeBarRef = ref<HTMLElement | null>(null)
const previousVolume = ref(0.7)
const activeTab = ref<'playlist' | 'favorites'>('playlist')
const visualizerBars = ref<number[]>(new Array(32).fill(0))
let animationId: number | null = null
let coverColors = ref(['#e94560', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'])

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const volumeIcon = computed(() => {
  if (volume.value === 0) return 'fa-volume-xmark'
  if (volume.value < 0.3) return 'fa-volume-off'
  if (volume.value < 0.7) return 'fa-volume-low'
  return 'fa-volume-high'
})

function onProgressClick(e: MouseEvent) {
  if (!progressBarRef.value || !duration.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  seek(percent * duration.value)
}

function onVolumeClick(e: MouseEvent) {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  setVolume(percent)
}

function toggleMute() {
  if (volume.value > 0) {
    previousVolume.value = volume.value
    setVolume(0)
  } else {
    setVolume(previousVolume.value)
  }
}

let time = 0
function animateVisualizer() {
  time += 0.05
  if (hasRealVisualizer.value && isPlaying.value) {
    const data = updateFrequencyData()
    if (data) {
      const barCount = visualizerBars.value.length
      const step = Math.floor(data.length / barCount)
      for (let i = 0; i < barCount; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) {
          sum += data[i * step + j] || 0
        }
        const avg = sum / step
        visualizerBars.value[i] = Math.max(4, (avg / 255) * 100)
      }
    }
  } else if (isPlaying.value) {
    const barCount = visualizerBars.value.length
    for (let i = 0; i < barCount; i++) {
      const wave = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5
      const noise = Math.random() * 0.3
      visualizerBars.value[i] = Math.max(4, (wave + noise) * 60)
    }
  } else {
    for (let i = 0; i < visualizerBars.value.length; i++) {
      visualizerBars.value[i] = 4 + Math.random() * 6
    }
  }
  animationId = requestAnimationFrame(animateVisualizer)
}

function handleFileUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('audio/')) return

    const url = URL.createObjectURL(file)
    const title = file.name.replace(/\.[^/.]+$/, '')
    const randomColor = coverColors.value[Math.floor(Math.random() * coverColors.value.length)]
    const colorIndex = coverColors.value.indexOf(randomColor)
    
    const prompts = [
      `Abstract%20colorful%20music%20waves%20digital%20art%20album%20cover%20blue%20purple`,
      `Neon%20synthwave%20retro%20album%20cover%20pink%20orange`,
      `Peaceful%20nature%20ambient%20album%20cover%20green%20teal`,
      `Jazz%20club%20smoky%20atmosphere%20album%20cover%20gold%20black`,
      `Electronic%20beats%20futuristic%20album%20cover%20cyan%20magenta`
    ]

    const newSong = addSong({
      title: title,
      artist: '本地音乐',
      src: url,
      cover: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompts[colorIndex]}&image_size=square`,
    })

    if (newSong) {
      switchSong(playlist.value.length - 1)
    }
  })

  input.value = ''
}

onMounted(() => {
  restoreState()
  initAudio()
  animateVisualizer()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>
