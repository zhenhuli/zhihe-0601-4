export interface Song {
  id: number
  title: string
  artist: string
  src: string
  cover: string
}

export type PlayMode = 'sequential' | 'loop' | 'random'

const STORAGE_KEY = 'music-player-state'

const playlist: Song[] = [
  {
    id: 1,
    title: 'SoundHelix Song 1',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Abstract%20colorful%20music%20waves%20digital%20art%20album%20cover%20blue%20purple&image_size=square',
  },
  {
    id: 2,
    title: 'SoundHelix Song 2',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Neon%20synthwave%20retro%20album%20cover%20pink%20orange&image_size=square',
  },
  {
    id: 3,
    title: 'SoundHelix Song 3',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Peaceful%20nature%20ambient%20album%20cover%20green%20teal&image_size=square',
  },
  {
    id: 4,
    title: 'SoundHelix Song 6',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Jazz%20club%20smoky%20atmosphere%20album%20cover%20gold%20black&image_size=square',
  },
  {
    id: 5,
    title: 'SoundHelix Song 8',
    artist: 'T. Schürger',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Electronic%20beats%20futuristic%20album%20cover%20cyan%20magenta&image_size=square',
  },
]

interface PersistedState {
  volume: number
  currentIndex: number
  currentTime: number
  playMode: PlayMode
  favorites: number[]
}

function loadPersistedState(): Partial<PersistedState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function persistState(state: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function useMusicPlayer() {
  const audio = useState<HTMLAudioElement | null>('audio', () => null)
  const audioContext = useState<AudioContext | null>('audioContext', () => null)
  const analyser = useState<AnalyserNode | null>('analyser', () => null)
  const source = useState<MediaElementAudioSourceNode | null>('source', () => null)
  const frequencyData = useState<Uint8Array | null>('frequencyData', () => null)
  const isPlaying = useState<boolean>('isPlaying', () => false)
  const currentIndex = useState<number>('currentIndex', () => 0)
  const currentTime = useState<number>('currentTime', () => 0)
  const duration = useState<number>('duration', () => 0)
  const volume = useState<number>('volume', () => 0.7)
  const playMode = useState<PlayMode>('playMode', () => 'sequential')
  const favorites = useState<number[]>('favorites', () => [])
  const isRestored = useState<boolean>('isRestored', () => false)
  const playlistRef = useState<Song[]>('playlist', () => [...playlist])

  const currentSong = computed(() => playlistRef.value[currentIndex.value])

  const hasRealVisualizer = computed(() => {
    return !!analyser.value && currentSong.value?.src?.startsWith('blob:')
  })

  const favoriteSongs = computed(() =>
    playlistRef.value.filter((song) => favorites.value.includes(song.id))
  )

  function isFavorite(songId: number): boolean {
    return favorites.value.includes(songId)
  }

  function toggleFavorite(songId: number) {
    const idx = favorites.value.indexOf(songId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(songId)
    }
    saveState()
  }

  const playModeIcon = computed(() => {
    switch (playMode.value) {
      case 'sequential':
        return 'fa-repeat'
      case 'loop':
        return 'fa-repeat'
      case 'random':
        return 'fa-shuffle'
    }
  })

  const playModeLabel = computed(() => {
    switch (playMode.value) {
      case 'sequential':
        return '顺序播放'
      case 'loop':
        return '单曲循环'
      case 'random':
        return '随机播放'
    }
  })

  function togglePlayMode() {
    const modes: PlayMode[] = ['sequential', 'loop', 'random']
    const idx = modes.indexOf(playMode.value)
    playMode.value = modes[(idx + 1) % modes.length]
    saveState()
  }

  function getNextIndex(): number {
    switch (playMode.value) {
      case 'loop':
        return currentIndex.value
      case 'random': {
        if (playlistRef.value.length <= 1) return 0
        let nextIdx: number
        do {
          nextIdx = Math.floor(Math.random() * playlistRef.value.length)
        } while (nextIdx === currentIndex.value)
        return nextIdx
      }
      case 'sequential':
      default:
        return (currentIndex.value + 1) % playlistRef.value.length
    }
  }

  function getPrevIndex(): number {
    switch (playMode.value) {
      case 'loop':
        return currentIndex.value
      case 'random': {
        if (playlistRef.value.length <= 1) return 0
        let prevIdx: number
        do {
          prevIdx = Math.floor(Math.random() * playlistRef.value.length)
        } while (prevIdx === currentIndex.value)
        return prevIdx
      }
      case 'sequential':
      default:
        return (currentIndex.value - 1 + playlistRef.value.length) % playlistRef.value.length
    }
  }

  let saveTimer: ReturnType<typeof setInterval> | null = null
  let savedState: Partial<PersistedState> = {}

  function saveState() {
    persistState({
      volume: volume.value,
      currentIndex: currentIndex.value,
      currentTime: currentTime.value,
      playMode: playMode.value,
      favorites: favorites.value,
    })
  }

  function restoreState() {
    if (isRestored.value) return
    const saved = loadPersistedState()
    savedState = saved

    if (typeof saved.volume === 'number') {
      volume.value = saved.volume
    }
    if (typeof saved.currentIndex === 'number') {
      currentIndex.value = saved.currentIndex
    }
    if (typeof saved.currentTime === 'number') {
      currentTime.value = saved.currentTime
    }
    if (saved.playMode) {
      playMode.value = saved.playMode
    }
    if (Array.isArray(saved.favorites)) {
      favorites.value = saved.favorites
    }

    isRestored.value = true
  }

  function initAudio() {
    if (typeof window === 'undefined') return
    if (audio.value) return

    restoreState()

    const el = new Audio()
    el.volume = volume.value
    el.preload = 'metadata'

    el.addEventListener('timeupdate', () => {
      currentTime.value = el.currentTime
    })

    el.addEventListener('loadedmetadata', () => {
      duration.value = el.duration
      if (
        typeof savedState.currentTime === 'number' &&
        savedState.currentTime > 0 &&
        savedState.currentIndex === currentIndex.value
      ) {
        el.currentTime = savedState.currentTime
        currentTime.value = savedState.currentTime
      }
    })

    el.addEventListener('ended', () => {
      if (playMode.value === 'loop') {
        el.currentTime = 0
        el.play()
        return
      }
      next()
    })

    el.addEventListener('error', (e) => {
      console.error('Audio error:', e)
    })

    audio.value = el
    el.src = playlistRef.value[currentIndex.value].src

    if (saveTimer) clearInterval(saveTimer)
    saveTimer = setInterval(() => {
      saveState()
    }, 3000)

    window.addEventListener('beforeunload', () => {
      saveState()
    })
  }

  function initAudioContext() {
    if (typeof window === 'undefined') return
    if (!audio.value) return
    if (audioContext.value) return

    const currentSrc = audio.value.src
    if (!currentSrc.startsWith('blob:')) {
      console.log('Skipping audio context for non-blob URL to avoid CORS issues')
      return
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ana = ctx.createAnalyser()
      ana.fftSize = 256
      const srcNode = ctx.createMediaElementSource(audio.value)
      srcNode.connect(ana)
      ana.connect(ctx.destination)

      audioContext.value = ctx
      analyser.value = ana
      source.value = srcNode
      frequencyData.value = new Uint8Array(ana.frequencyBinCount)
    } catch (error) {
      console.warn('Failed to initialize audio context:', error)
    }
  }

  function updateFrequencyData() {
    if (!analyser.value || !frequencyData.value) return
    analyser.value.getByteFrequencyData(frequencyData.value)
    return frequencyData.value
  }

  function addSong(song: Omit<Song, 'id'>) {
    const maxId = Math.max(...playlistRef.value.map(s => s.id), 0)
    const newSong: Song = {
      ...song,
      id: maxId + 1
    }
    playlistRef.value.push(newSong)
    return newSong
  }

  function play() {
    if (!audio.value) initAudio()
    if (!audioContext.value) {
      initAudioContext()
    }
    if (audioContext.value?.state === 'suspended') {
      audioContext.value.resume()
    }
    audio.value!.play().catch((e) => {
      console.error('Play failed:', e)
    })
    isPlaying.value = true
  }

  function pause() {
    audio.value?.pause()
    isPlaying.value = false
    saveState()
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function switchSong(index: number) {
    if (index < 0 || index >= playlistRef.value.length) return
    currentIndex.value = index
    if (!audio.value) initAudio()

    const newSrc = playlistRef.value[index].src
    const isBlob = newSrc.startsWith('blob:')

    if (isBlob && !audioContext.value) {
    } else if (!isBlob && audioContext.value) {
      try {
        audioContext.value.close()
      } catch {}
      audioContext.value = null
      analyser.value = null
      source.value = null
    }

    const wasPlaying = isPlaying.value
    audio.value!.src = newSrc
    audio.value!.load()
    currentTime.value = 0
    duration.value = 0

    if (wasPlaying) {
      if (isBlob && !audioContext.value) {
        initAudioContext()
      }
      audio.value!.play().catch(console.error)
      isPlaying.value = true
    }
    saveState()
  }

  function next() {
    const nextIndex = getNextIndex()
    switchSong(nextIndex)
    play()
  }

  function prev() {
    const prevIndex = getPrevIndex()
    switchSong(prevIndex)
    play()
  }

  function seek(time: number) {
    if (!audio.value) return
    audio.value.currentTime = time
    currentTime.value = time
  }

  function setVolume(val: number) {
    volume.value = val
    if (audio.value) {
      audio.value.volume = val
    }
    saveState()
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    playlist: playlistRef,
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
    pause,
    next,
    prev,
    seek,
    setVolume,
    switchSong,
    formatTime,
    initAudio,
    restoreState,
    frequencyData,
    updateFrequencyData,
    addSong,
    hasRealVisualizer,
  }
}
