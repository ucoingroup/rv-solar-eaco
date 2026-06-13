/**
 * 营地详情页
 */
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/models/campsite_model.dart';
import '../bloc/campsite_bloc.dart';

@RoutePage()
class CampsiteDetailPage extends StatefulWidget {
  final String id;
  
  const CampsiteDetailPage({super.key, @PathParam('id') required this.id});

  @override
  State<CampsiteDetailPage> createState() => _CampsiteDetailPageState();
}

class _CampsiteDetailPageState extends State<CampsiteDetailPage> {
  @override
  void initState() {
    super.initState();
    context.read<CampsiteBloc>().add(LoadCampsiteDetail(widget.id));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<CampsiteBloc, CampsiteState>(
        builder: (context, state) {
          if (state is CampsiteLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (state is CampsiteDetailLoaded) {
            final campsite = state.campsite;
            return CustomScrollView(
              slivers: [
                // 顶部图片
                SliverAppBar(
                  expandedHeight: 250,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Container(
                      color: AppColors.primary.withOpacity(0.1),
                      child: campsite.images.isNotEmpty
                          ? Image.network(campsite.images.first, fit: BoxFit.cover)
                          : const Center(child: Icon(Icons.landscape, size: 80, color: AppColors.primary)),
                    ),
                  ),
                ),
                
                // 内容
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // 名称和评分
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    campsite.name,
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on, size: 16, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text(
                                        campsite.countryName,
                                        style: const TextStyle(color: AppColors.textSecondary),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            if (campsite.rating > 0)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.amber.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.star, size: 16, color: Colors.amber),
                                    const SizedBox(width: 4),
                                    Text(
                                      campsite.rating.toStringAsFixed(1),
                                      style: const TextStyle(fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // 设施标签
                        const Text(
                          '设施服务',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: campsite.amenities.map((amenity) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(_getAmenityIcon(amenity), size: 16, color: AppColors.primary),
                                  const SizedBox(width: 6),
                                  Text(_getAmenityName(amenity), style: const TextStyle(fontSize: 12)),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // 充电设施
                        if (campsite.chargingSpots > 0) ...[
                          const Text(
                            '光伏充电设施',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.ev_station, color: AppColors.primary, size: 32),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${campsite.chargingSpots}个充电桩可用',
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      Text(
                                        '最大功率 ${campsite.maxChargingPowerW / 1000}kW',
                                        style: const TextStyle(color: AppColors.textSecondary),
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    context.router.push(const ChargingRoute());
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primary,
                                  ),
                                  child: const Text('扫码充电'),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                        ],
                        
                        // 描述
                        if (campsite.description != null) ...[
                          const Text(
                            '营地介绍',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            campsite.description!,
                            style: const TextStyle(
                              color: AppColors.textSecondary,
                              height: 1.6,
                            ),
                          ),
                          const SizedBox(height: 24),
                        ],
                        
                        // 联系信息
                        const Text(
                          '联系信息',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        if (campsite.contactPhone != null)
                          _InfoRow(
                            icon: Icons.phone,
                            label: '电话',
                            value: campsite.contactPhone!,
                          ),
                        if (campsite.contactWechat != null)
                          _InfoRow(
                            icon: Icons.chat,
                            label: '微信',
                            value: campsite.contactWechat!,
                          ),
                        
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }
          
          return const Center(child: Text('加载失败'));
        },
      ),
      bottomNavigationBar: BlocBuilder<CampsiteBloc, CampsiteState>(
        builder: (context, state) {
          if (state is CampsiteDetailLoaded) {
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '¥${(state.campsite.priceUsdCents / 100).toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                        const Text(
                          '/晚',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('预订功能开发中')),
                          );
                        },
                        child: const Text('立即预订'),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
          return const SizedBox();
        },
      ),
    );
  }
  
  IconData _getAmenityIcon(String amenity) {
    const icons = {
      'wifi': Icons.wifi,
      'shower': Icons.shower,
      'toilet': Icons.wc,
      'solar_charging': Icons.ev_station,
      'restaurant': Icons.restaurant,
      'parking': Icons.local_parking,
      'hiking': Icons.hiking,
    };
    return icons[amenity.toLowerCase()] ?? Icons.check_circle;
  }
  
  String _getAmenityName(String amenity) {
    const names = {
      'wifi': 'WiFi',
      'shower': '淋浴',
      'toilet': '厕所',
      'solar_charging': '光伏充电',
      'restaurant': '餐厅',
      'parking': '停车',
      'hiking': '徒步',
    };
    return names[amenity.toLowerCase()] ?? amenity;
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  
  const _InfoRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}