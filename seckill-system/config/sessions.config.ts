import type { SeckillSession, SessionStatus } from '~/types'

const now = Date.now()
const oneHour = 60 * 60 * 1000

export const sessionsConfig: SeckillSession[] = [
  {
    id: 'session-00',
    name: '00点场',
    title: '凌晨特惠',
    startTime: now - 2 * oneHour,
    endTime: now - oneHour,
    status: 'past' as SessionStatus,
    productIds: ['prod-001', 'prod-002', 'prod-003'],
    discountRate: 0.5,
    isHot: false,
    sort: 1
  },
  {
    id: 'session-10',
    name: '10点场',
    title: '早场秒杀',
    startTime: now - oneHour,
    endTime: now + oneHour,
    status: 'active' as SessionStatus,
    productIds: ['prod-101', 'prod-102', 'prod-103', 'prod-104', 'prod-105', 'prod-106'],
    discountRate: 0.4,
    isHot: true,
    sort: 2
  },
  {
    id: 'session-14',
    name: '14点场',
    title: '午后狂欢',
    startTime: now + 3 * oneHour,
    endTime: now + 5 * oneHour,
    status: 'upcoming' as SessionStatus,
    productIds: ['prod-201', 'prod-202', 'prod-203', 'prod-204'],
    discountRate: 0.35,
    isHot: true,
    sort: 3
  },
  {
    id: 'session-20',
    name: '20点场',
    title: '晚间爆场',
    startTime: now + 9 * oneHour,
    endTime: now + 11 * oneHour,
    status: 'upcoming' as SessionStatus,
    productIds: ['prod-301', 'prod-302', 'prod-303', 'prod-304', 'prod-305'],
    discountRate: 0.3,
    isHot: true,
    sort: 4
  },
  {
    id: 'session-22',
    name: '22点场',
    title: '夜猫专属',
    startTime: now + 11 * oneHour,
    endTime: now + 13 * oneHour,
    status: 'upcoming' as SessionStatus,
    productIds: ['prod-401', 'prod-402', 'prod-403'],
    discountRate: 0.25,
    isHot: false,
    sort: 5
  }
]

export const getSessionById = (id: string): SeckillSession | undefined => {
  return sessionsConfig.find(s => s.id === id)
}

export const getActiveSession = (): SeckillSession | undefined => {
  return sessionsConfig.find(s => s.status === 'active')
}

export const getUpcomingSessions = (): SeckillSession[] => {
  return sessionsConfig.filter(s => s.status === 'upcoming').sort((a, b) => a.sort - b.sort)
}

export const updateSessionsStatus = (): void => {
  const currentTime = Date.now()
  sessionsConfig.forEach(session => {
    if (currentTime < session.startTime) {
      session.status = 'upcoming' as SessionStatus
    } else if (currentTime >= session.startTime && currentTime < session.endTime) {
      session.status = 'active' as SessionStatus
    } else {
      session.status = 'past' as SessionStatus
    }
  })
}
