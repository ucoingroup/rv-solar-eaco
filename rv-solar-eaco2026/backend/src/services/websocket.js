/**
 * WebSocket服务 - 实时充电数据推送
 */
class WebSocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId
    this.chargingSessions = new Map(); // chargingId -> { userId, chargerId, interval }
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 WebSocket connected: ${socket.id}`);

      // 用户连接时验证身份
      socket.on('authenticate', (data) => {
        const { userId, token } = data;
        // 简单验证，实际应使用JWT
        if (userId) {
          this.connectedUsers.set(userId, socket.id);
          socket.userId = userId;
          socket.join(`user:${userId}`);
          console.log(`👤 User ${userId} authenticated`);
        }
      });

      // 订阅充电桩实时数据
      socket.on('subscribe_charger', (data) => {
        const { chargerId, chargingId } = data;
        socket.join(`charger:${chargerId}`);
        
        // 存储充电会话
        if (chargingId) {
          this.chargingSessions.set(chargingId, {
            socketId: socket.id,
            chargerId,
            userId: socket.userId
          });
        }
        
        console.log(`📡 Socket ${socket.id} subscribed to charger ${chargerId}`);
      });

      // 取消订阅
      socket.on('unsubscribe_charger', (data) => {
        const { chargerId } = data;
        socket.leave(`charger:${chargerId}`);
      });

      // 断开连接
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        console.log(`🔌 WebSocket disconnected: ${socket.id}`);
      });
    });
  }

  // 推送充电实时数据
  pushChargingData(chargerId, data) {
    this.io.to(`charger:${chargerId}`).emit('charging_update', {
      chargerId,
      ...data,
      timestamp: Date.now()
    });
  }

  // 推送充电完成事件
  pushChargingComplete(chargingId, result) {
    const session = this.chargingSessions.get(chargingId);
    if (session) {
      this.io.to(`user:${session.userId}`).emit('charging_complete', {
        chargingId,
        ...result,
        timestamp: Date.now()
      });
      this.chargingSessions.delete(chargingId);
    }
  }

  // 推送奖励发放事件
  pushRewardGranted(userId, rewardData) {
    this.io.to(`user:${userId}`).emit('reward_granted', {
      ...rewardData,
      timestamp: Date.now()
    });
  }
}

let wsService = null;

function WebSocketServiceInit(io) {
  if (!wsService) {
    wsService = new WebSocketService(io);
    wsService.initialize();
  }
  return wsService;
}

module.exports = { WebSocketServiceInit };