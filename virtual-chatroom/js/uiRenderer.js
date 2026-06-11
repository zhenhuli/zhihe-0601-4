import { EventEmitter } from './EventEmitter.js';

const STATE_LABELS = {
  new: '新建',
  connecting: 'ICE 收集中...',
  connected: '已连接',
  failed: '连接失败',
  reconnecting: '重连中...',
  disconnected: '已断开',
};

const STATE_COLORS = {
  new: '#888',
  connecting: '#f0ad4e',
  connected: '#5cb85c',
  failed: '#d9534f',
  reconnecting: '#f0ad4e',
  disconnected: '#d9534f',
};

export class UIRenderer extends EventEmitter {
  constructor(roomState, connectionSimulator, chatSimulator) {
    super();
    this.roomState = roomState;
    this.connectionSimulator = connectionSimulator;
    this.chatSimulator = chatSimulator;
    this._volumeUpdateInterval = null;
    this._speakingSimInterval = null;
  }

  init() {
    this._cacheDom();
    this._bindLobbyEvents();
    this._bindRoomEvents();
    this._bindChatEvents();
    this._bindScreenShareEvents();
    this._subscribeToStateChanges();
  }

  _cacheDom() {
    this.lobbyScreen = document.getElementById('lobby-screen');
    this.roomScreen = document.getElementById('room-screen');
    this.btnCreateRoom = document.getElementById('btn-create-room');
    this.btnJoinRoom = document.getElementById('btn-join-room');
    this.inputRoomId = document.getElementById('input-room-id');
    this.lobbyError = document.getElementById('lobby-error');
    this.roomIdDisplay = document.getElementById('room-id-display');
    this.roomStatusBadge = document.getElementById('room-status-badge');
    this.participantsGrid = document.getElementById('participants-grid');
    this.btnMute = document.getElementById('btn-mute');
    this.btnPushToTalk = document.getElementById('btn-push-to-talk');
    this.btnShareScreen = document.getElementById('btn-share-screen');
    this.btnReset = document.getElementById('btn-reset');
    this.btnSimulateDisconnect = document.getElementById('btn-simulate-disconnect');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.btnSendChat = document.getElementById('btn-send-chat');
    this.btnToggleChat = document.getElementById('btn-toggle-chat');
    this.chatPanel = document.getElementById('chat-panel');
    this.btnChatFloatToggle = document.getElementById('btn-chat-float-toggle');
    this.screenSharePicker = document.getElementById('screen-share-picker');
    this.btnCancelShare = document.getElementById('btn-cancel-share');
  }

  _bindLobbyEvents() {
    this.btnCreateRoom.addEventListener('click', () => {
      this.emit('createRoom');
    });

    this.btnJoinRoom.addEventListener('click', () => {
      const roomId = this.inputRoomId.value.trim();
      this.emit('joinRoom', { roomId });
    });

    this.inputRoomId.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.btnJoinRoom.click();
      }
    });

    this.inputRoomId.addEventListener('input', () => {
      this.inputRoomId.value = this.inputRoomId.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  _bindRoomEvents() {
    this.btnMute.addEventListener('click', () => {
      this.emit('toggleMute');
    });

    let isPushing = false;
    this.btnPushToTalk.addEventListener('mousedown', () => {
      if (!isPushing) {
        isPushing = true;
        this.emit('startSpeaking');
      }
    });
    this.btnPushToTalk.addEventListener('mouseup', () => {
      if (isPushing) {
        isPushing = false;
        this.emit('stopSpeaking');
      }
    });
    this.btnPushToTalk.addEventListener('mouseleave', () => {
      if (isPushing) {
        isPushing = false;
        this.emit('stopSpeaking');
      }
    });

    this.btnPushToTalk.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!isPushing) {
        isPushing = true;
        this.emit('startSpeaking');
      }
    });
    this.btnPushToTalk.addEventListener('touchend', () => {
      if (isPushing) {
        isPushing = false;
        this.emit('stopSpeaking');
      }
    });

    this.btnReset.addEventListener('click', () => {
      this.emit('reset');
    });

    this.btnSimulateDisconnect.addEventListener('click', () => {
      this.emit('simulateDisconnect');
    });
  }

  _bindChatEvents() {
    this.btnSendChat.addEventListener('click', () => {
      const content = this.chatInput.value.trim();
      if (content) {
        this.emit('sendChat', { content });
        this.chatInput.value = '';
      }
    });

    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.btnSendChat.click();
      }
    });

    this.btnChatFloatToggle.addEventListener('click', () => {
      this._openChatPanel();
    });

    this.btnToggleChat.addEventListener('click', () => {
      this._closeChatPanel();
    });
  }

  _openChatPanel() {
    this.chatPanel.classList.add('open');
    this.btnChatFloatToggle.classList.add('panel-open');
  }

  _closeChatPanel() {
    this.chatPanel.classList.remove('open');
    this.btnChatFloatToggle.classList.remove('panel-open');
  }

  _bindScreenShareEvents() {
    this.btnShareScreen.addEventListener('click', () => {
      if (this.roomState.screenSharingParticipantId) {
        this.emit('stopScreenShare');
      } else {
        this.screenSharePicker.classList.remove('hidden');
      }
    });

    this.btnCancelShare.addEventListener('click', () => {
      this.screenSharePicker.classList.add('hidden');
    });

    const screenItems = this.screenSharePicker.querySelectorAll('.screen-item');
    screenItems.forEach(item => {
      item.addEventListener('click', () => {
        const screenId = item.dataset.screen;
        this.screenSharePicker.classList.add('hidden');
        this.emit('startScreenShare', { screenId });
      });
    });
  }

  _subscribeToStateChanges() {
    this.roomState.on('roomJoined', ({ roomId }) => {
      this._showRoomScreen(roomId);
    });

    this.roomState.on('participantJoined', ({ participant }) => {
      this._renderParticipants();
    });

    this.roomState.on('participantLeft', ({ participant }) => {
      this._removeParticipantCard(participant.id);
    });

    this.roomState.on('participantUpdated', ({ participant, updates }) => {
      this._updateParticipantCard(participant);
      if (updates.isMuted !== undefined && participant.isSelf) {
        this._updateMuteButton(participant.isMuted);
      }
    });

    this.roomState.on('screenShareStarted', ({ participantId }) => {
      this._updateScreenShareState(participantId);
    });

    this.roomState.on('screenShareStopped', () => {
      this._updateScreenShareState(null);
    });

    this.roomState.on('roomLeft', () => {
      this._showLobbyScreen();
    });

    this.chatSimulator.on('newMessage', ({ message }) => {
      this._appendChatMessage(message);
    });

    this.connectionSimulator.on('connectionStateChange', ({ participantId }) => {
      const p = this.roomState.getParticipant(participantId);
      if (p) this._updateParticipantCard(p);
      this._updateRoomStatusBadge();
    });

    this.connectionSimulator.on('packetLossUpdate', ({ participantId, packetLoss }) => {
      this._updatePacketLoss(participantId, packetLoss);
    });

    this.connectionSimulator.on('connectionPermanentFailure', ({ participantId }) => {
      const p = this.roomState.getParticipant(participantId);
      if (p) this._updateParticipantCard(p);
    });

    this.roomState.on('error', ({ message }) => {
      this.lobbyError.textContent = message;
      this.lobbyError.classList.remove('hidden');
      setTimeout(() => {
        this.lobbyError.classList.add('hidden');
      }, 3000);
    });
  }

  _showRoomScreen(roomId) {
    this.lobbyScreen.classList.remove('active');
    this.roomScreen.classList.add('active');
    this.btnChatFloatToggle.classList.remove('hidden');
    this.roomIdDisplay.textContent = roomId;
    this._renderParticipants();
    this._updateRoomStatusBadge();
    this._startVolumeUpdates();
    this._startFakeSpeakingSimulation();
  }

  _showLobbyScreen() {
    this.roomScreen.classList.remove('active');
    this.lobbyScreen.classList.add('active');
    this._stopVolumeUpdates();
    this._stopFakeSpeakingSimulation();
    this._closeChatPanel();
    this.btnChatFloatToggle.classList.add('hidden');
    this.participantsGrid.innerHTML = '';
    this.chatMessages.innerHTML = '';
    this.lobbyError.classList.add('hidden');
    this.btnMute.querySelector('.label').textContent = '静音';
    this.btnMute.querySelector('.icon').textContent = '🎤';
    this.btnMute.classList.remove('muted');
  }

  _renderParticipants() {
    const participants = this.roomState.getAllParticipants();
    for (const p of participants) {
      if (!document.getElementById('participant-' + p.id)) {
        this._createParticipantCard(p);
      }
    }
    this._updateGridLayout();
  }

  _createParticipantCard(participant) {
    const card = document.createElement('div');
    card.id = 'participant-' + participant.id;
    card.className = 'participant-card';
    card.dataset.participantId = participant.id;

    card.innerHTML = `
      <div class="avatar-container">
        <div class="avatar ${participant.isSpeaking ? 'speaking' : ''}">${participant.avatar}</div>
        <div class="connection-dot" style="background:${STATE_COLORS[participant.connectionState] || '#888'}"></div>
      </div>
      <div class="participant-name">${participant.name}${participant.isSelf ? ' (我)' : ''}</div>
      <div class="connection-state" style="color:${STATE_COLORS[participant.connectionState] || '#888'}">
        ${STATE_LABELS[participant.connectionState] || participant.connectionState}
      </div>
      <div class="packet-loss ${participant.connectionState === 'connected' ? '' : 'hidden'}">
        丢包: <span class="loss-value">0.0</span>%
      </div>
      <div class="volume-bar-container">
        <div class="volume-bar-fill" style="width:0%"></div>
      </div>
      <div class="participant-actions">
        ${participant.isSelf ? '' : `
          <button class="btn btn-xs btn-remote-mute" data-id="${participant.id}">
            🔇 远端静音
          </button>
        `}
      </div>
      <div class="screen-share-indicator hidden">
        🖥️ 正在共享
      </div>
      <div class="viewing-share hidden">
        👁️ 观看屏幕共享
      </div>
    `;

    if (!participant.isSelf) {
      const muteBtn = card.querySelector('.btn-remote-mute');
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          const current = this.roomState.getParticipant(participant.id);
          if (current) {
            this.roomState.updateParticipant(participant.id, { isMuted: !current.isMuted });
          }
        });
      }
    }

    this.participantsGrid.appendChild(card);
  }

  _updateParticipantCard(participant) {
    const card = document.getElementById('participant-' + participant.id);
    if (!card) return;

    const avatar = card.querySelector('.avatar');
    avatar.className = 'avatar' + (participant.isSpeaking ? ' speaking' : '');
    avatar.textContent = participant.avatar;

    card.querySelector('.participant-name').textContent =
      participant.name + (participant.isSelf ? ' (我)' : '');

    const connState = card.querySelector('.connection-state');
    connState.textContent = STATE_LABELS[participant.connectionState] || participant.connectionState;
    connState.style.color = STATE_COLORS[participant.connectionState] || '#888';

    const dot = card.querySelector('.connection-dot');
    dot.style.background = STATE_COLORS[participant.connectionState] || '#888';

    const packetLossEl = card.querySelector('.packet-loss');
    if (participant.connectionState === 'connected') {
      packetLossEl.classList.remove('hidden');
    } else {
      packetLossEl.classList.add('hidden');
    }

    if (participant.isMuted) {
      avatar.classList.add('muted-avatar');
    } else {
      avatar.classList.remove('muted-avatar');
    }

    if (participant.isMuted) {
      avatar.classList.remove('speaking');
    }

    const shareIndicator = card.querySelector('.screen-share-indicator');
    const viewIndicator = card.querySelector('.viewing-share');
    const isSharing = this.roomState.screenSharingParticipantId === participant.id;

    if (isSharing) {
      shareIndicator.classList.remove('hidden');
      viewIndicator.classList.add('hidden');
    } else if (this.roomState.screenSharingParticipantId && !isSharing) {
      shareIndicator.classList.add('hidden');
      viewIndicator.classList.remove('hidden');
    } else {
      shareIndicator.classList.add('hidden');
      viewIndicator.classList.add('hidden');
    }
  }

  _removeParticipantCard(id) {
    const card = document.getElementById('participant-' + id);
    if (card) card.remove();
    this._updateGridLayout();
  }

  _updateGridLayout() {
    const count = this.roomState.getParticipantCount();
    const emptySlots = MAX_PARTICIPANTS - count;
    this.participantsGrid.querySelectorAll('.empty-slot').forEach(e => e.remove());

    for (let i = 0; i < emptySlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'participant-card empty-slot';
      slot.innerHTML = `
        <div class="avatar-container">
          <div class="avatar empty-avatar">➕</div>
        </div>
        <div class="participant-name">等待加入...</div>
        <div class="connection-state" style="color:#555">未连接</div>
      `;
      this.participantsGrid.appendChild(slot);
    }
  }

  _updateMuteButton(isMuted) {
    const label = this.btnMute.querySelector('.label');
    const icon = this.btnMute.querySelector('.icon');
    if (isMuted) {
      label.textContent = '取消静音';
      icon.textContent = '🔇';
      this.btnMute.classList.add('muted');
    } else {
      label.textContent = '静音';
      icon.textContent = '🎤';
      this.btnMute.classList.remove('muted');
    }
  }

  _updateRoomStatusBadge() {
    const participants = this.roomState.getAllParticipants();
    const states = participants.map(p => p.connectionState);
    if (states.every(s => s === 'connected')) {
      this.roomStatusBadge.textContent = '全部已连接';
      this.roomStatusBadge.style.background = '#5cb85c';
    } else if (states.some(s => s === 'failed')) {
      this.roomStatusBadge.textContent = '部分连接失败';
      this.roomStatusBadge.style.background = '#d9534f';
    } else if (states.some(s => s === 'reconnecting')) {
      this.roomStatusBadge.textContent = '重连中';
      this.roomStatusBadge.style.background = '#f0ad4e';
    } else if (states.some(s => s === 'connecting')) {
      this.roomStatusBadge.textContent = '连接中';
      this.roomStatusBadge.style.background = '#f0ad4e';
    } else if (states.some(s => s === 'disconnected')) {
      this.roomStatusBadge.textContent = '已断开';
      this.roomStatusBadge.style.background = '#d9534f';
    } else {
      this.roomStatusBadge.textContent = '未知';
      this.roomStatusBadge.style.background = '#888';
    }
  }

  _updatePacketLoss(participantId, packetLoss) {
    const card = document.getElementById('participant-' + participantId);
    if (!card) return;
    const lossValue = card.querySelector('.loss-value');
    if (lossValue) {
      lossValue.textContent = packetLoss.toFixed(1);
    }
  }

  _startVolumeUpdates() {
    this._volumeUpdateInterval = setInterval(() => {
      const participants = this.roomState.getAllParticipants();
      for (const p of participants) {
        const card = document.getElementById('participant-' + p.id);
        if (!card) continue;

        const volumeFill = card.querySelector('.volume-bar-fill');
        if (!volumeFill) continue;

        const vol = this.connectionSimulator.getVolumeForParticipant(p.id);
        const pct = Math.min(100, vol);
        volumeFill.style.width = pct + '%';

        if (p.isMuted || p.connectionState !== 'connected') {
          volumeFill.style.background = '#555';
          volumeFill.style.width = '0%';
        } else if (p.isSpeaking) {
          volumeFill.style.background = '#5cb85c';
        } else {
          volumeFill.style.background = '#4a90d9';
        }
      }
    }, 100);
  }

  _stopVolumeUpdates() {
    if (this._volumeUpdateInterval) {
      clearInterval(this._volumeUpdateInterval);
      this._volumeUpdateInterval = null;
    }
  }

  _startFakeSpeakingSimulation() {
    this._speakingSimInterval = setInterval(() => {
      const participants = this.roomState.getAllParticipants().filter(p => !p.isSelf);
      for (const p of participants) {
        if (p.isMuted || p.connectionState !== 'connected') {
          if (p.isSpeaking) {
            this.roomState.updateParticipant(p.id, { isSpeaking: false });
          }
          continue;
        }
        const shouldSpeak = Math.random() < 0.12;
        if (shouldSpeak && !p.isSpeaking) {
          this.roomState.updateParticipant(p.id, { isSpeaking: true });
          const speakDuration = 1000 + Math.random() * 3000;
          setTimeout(() => {
            const current = this.roomState.getParticipant(p.id);
            if (current && current.isSpeaking) {
              this.roomState.updateParticipant(p.id, { isSpeaking: false });
            }
          }, speakDuration);
        }
      }
    }, 1500);
  }

  _stopFakeSpeakingSimulation() {
    if (this._speakingSimInterval) {
      clearInterval(this._speakingSimInterval);
      this._speakingSimInterval = null;
    }
  }

  _appendChatMessage(message) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message' + (message.isSelf ? ' self' : '');
    const time = message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    msgEl.innerHTML = `
      <div class="msg-header">
        <span class="msg-sender">${message.senderName}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-content">${this._escapeHtml(message.content)}</div>
    `;
    this.chatMessages.appendChild(msgEl);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  _updateScreenShareState(sharingId) {
    const participants = this.roomState.getAllParticipants();
    for (const p of participants) {
      this._updateParticipantCard(p);
    }
    if (sharingId) {
      this.btnShareScreen.querySelector('.label').textContent = '停止共享';
      this.btnShareScreen.querySelector('.icon').textContent = '🛑';
    } else {
      this.btnShareScreen.querySelector('.label').textContent = '共享屏幕';
      this.btnShareScreen.querySelector('.icon').textContent = '🖥️';
    }
  }

  destroy() {
    this._stopVolumeUpdates();
    this._stopFakeSpeakingSimulation();
    this.removeAllListeners();
  }
}
