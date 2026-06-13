/**
 * 充电页面
 */
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/theme/app_theme.dart';
import '../bloc/charging_bloc.dart';

@RoutePage()
class ChargingPage extends StatefulWidget {
  const ChargingPage({super.key});

  @override
  State<ChargingPage> createState() => _ChargingPageState();
}

class _ChargingPageState extends State<ChargingPage> {
  bool _isCharging = false;
  double _energyKwh = 0;
  double _powerW = 0;
  int _rewardEaco = 0;
  
  @override
  void initState() {
    super.initState();
    context.read<ChargingBloc>().add(const GetCurrentCharging());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('光伏充电'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => _showHistory(),
          ),
        ],
      ),
      body: BlocConsumer<ChargingBloc, ChargingState>(
        listener: (context, state) {
          if (state is ChargingStarted) {
            setState(() {
              _isCharging = true;
              _energyKwh = state.energyKwh;
              _powerW = state.powerW;
            });
          } else if (state is ChargingStopped) {
            setState(() {
              _isCharging = false;
              _energyKwh = 0;
              _powerW = 0;
              _rewardEaco = state.rewardEaco;
            });
            _showRewardDialog(state.rewardEaco, state.carbonKg);
          } else if (state is ChargingError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          if (state is ChargingLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (state is ChargingInProgress) {
            return _buildChargingUI(state);
          }
          
          return _buildIdleUI();
        },
      ),
    );
  }
  
  Widget _buildIdleUI() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // 二维码扫描区域
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.primary, width: 2),
                  ),
                  child: QrImageView(
                    data: 'rv-solar:charge?user=${DateTime.now().millisecondsSinceEpoch}',
                    version: QrVersions.auto,
                    size: 180,
                    backgroundColor: Colors.white,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  '扫描充电桩二维码',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  '将手机屏幕对准充电桩扫码区域',
                  style: TextStyle(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _InfoChip(icon: Icons.flash_on, label: '快充', color: Colors.orange),
                    const SizedBox(width: 12),
                    _InfoChip(icon: Icons.eco, label: '绿电', color: AppColors.primary),
                    const SizedBox(width: 12),
                    _InfoChip(icon: Icons.token, label: 'EACO', color: AppColors.accent),
                  ],
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 32),
          
          // 手动手动输入
          OutlinedButton.icon(
            onPressed: _showManualInput,
            icon: const Icon(Icons.keyboard),
            label: const Text('手动输入充电桩编号'),
          ),
          
          const SizedBox(height: 24),
          
          // 充电说明
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.info.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.info_outline, color: AppColors.info, size: 20),
                    SizedBox(width: 8),
                    Text('充电说明', style: TextStyle(fontWeight: FontWeight.w600)),
                  ],
                ),
                SizedBox(height: 12),
                Text('• 扫描光伏充电桩上的二维码开始充电', style: TextStyle(fontSize: 14)),
                SizedBox(height: 4),
                Text('• 充电功率根据日照强度自动调节', style: TextStyle(fontSize: 14)),
                SizedBox(height: 4),
                Text('• 使用EACO支付可享受10%折扣', style: TextStyle(fontSize: 14)),
                SizedBox(height: 4),
                Text('• 充电完成后自动发放绿电奖励', style: TextStyle(fontSize: 14)),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildChargingUI(ChargingInProgress state) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // 充电状态
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Column(
              children: [
                // 动画圆圈
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 200,
                      height: 200,
                      child: CircularProgressIndicator(
                        value: state.energyKwh / 50, // 假设最大50kWh
                        strokeWidth: 12,
                        backgroundColor: Colors.grey.shade200,
                        valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.ev_station, size: 48, color: AppColors.primary),
                        const SizedBox(height: 8),
                        Text(
                          '${state.energyKwh.toStringAsFixed(2)} kWh',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          '已充电量',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                // 实时数据
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _RealTimeData(
                      label: '功率',
                      value: '${(state.powerW / 1000).toStringAsFixed(1)} kW',
                      icon: Icons.flash_on,
                    ),
                    _RealTimeData(
                      label: '电压',
                      value: '${state.voltageV.toStringAsFixed(1)} V',
                      icon: Icons.electric_bolt,
                    ),
                    _RealTimeData(
                      label: '电流',
                      value: '${state.currentA.toStringAsFixed(1)} A',
                      icon: Icons.current_amp,
                    ),
                  ],
                ),
                
                const SizedBox(height: 24),
                
                // 预估奖励
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.card_giftcard, color: AppColors.accent),
                      const SizedBox(width: 8),
                      Text(
                        '预估可获得 ${(state.energyKwh * 1000).toInt()} EACO',
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.accent,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // 停止按钮
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      context.read<ChargingBloc>().add(StopCharging(state.chargingId));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.error,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('停止充电'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  void _showManualInput() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('手动输入充电桩编号'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: '例如: CHG-KH-001',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              if (controller.text.isNotEmpty) {
                context.read<ChargingBloc>().add(StartCharging(controller.text));
              }
            },
            child: const Text('开始充电'),
          ),
        ],
      ),
    );
  }
  
  void _showHistory() {
    context.read<ChargingBloc>().add(const GetChargingHistory());
  }
  
  void _showRewardDialog(int rewardEaco, double carbonKg) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.celebration, color: AppColors.accent),
            SizedBox(width: 8),
            Text('充电完成'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  const Text('🎉', style: TextStyle(fontSize: 48)),
                  const SizedBox(height: 8),
                  Text(
                    '+$rewardEaco EACO',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.accent,
                    ),
                  ),
                  const Text('绿电奖励已发放'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text('减少碳排放 ${carbonKg.toStringAsFixed(2)} kg'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  
  const _InfoChip({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(color: color, fontSize: 12)),
        ],
      ),
    );
  }
}

class _RealTimeData extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  
  const _RealTimeData({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primary),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}