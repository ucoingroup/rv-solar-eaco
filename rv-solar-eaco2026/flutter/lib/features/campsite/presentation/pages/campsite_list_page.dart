/**
 * 营地列表页
 */
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/models/campsite_model.dart';
import '../bloc/campsite_bloc.dart';

@RoutePage()
class CampsiteListPage extends StatefulWidget {
  const CampsiteListPage({super.key});

  @override
  State<CampsiteListPage> createState() => _CampsiteListPageState();
}

class _CampsiteListPageState extends State<CampsiteListPage> {
  final _searchController = TextEditingController();
  String? _selectedCountry;
  
  final _countries = ['全部', '哈萨克斯坦', '老挝', '巴基斯坦', '俄罗斯', '蒙古'];

  @override
  void initState() {
    super.initState();
    context.read<CampsiteBloc>().add(const LoadCampsites());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('附近营地'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterSheet,
          ),
        ],
      ),
      body: Column(
        children: [
          // 搜索栏
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: '搜索营地...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          context.read<CampsiteBloc>().add(const LoadCampsites());
                        },
                      )
                    : null,
              ),
              onSubmitted: (value) {
                if (value.isNotEmpty) {
                  context.read<CampsiteBloc>().add(SearchCampsites(value));
                }
              },
            ),
          ),
          
          // 国家筛选
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: _countries.map((country) {
                final isSelected = (_selectedCountry ?? '全部') == country;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(country),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        _selectedCountry = selected ? country : '全部';
                      });
                      if (country == '全部') {
                        context.read<CampsiteBloc>().add(const LoadCampsites());
                      } else {
                        context.read<CampsiteBloc>().add(
                          LoadCampsites(countryCode: _getCountryCode(country)),
                        );
                      }
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // 营地列表
          Expanded(
            child: BlocBuilder<CampsiteBloc, CampsiteState>(
              builder: (context, state) {
                if (state is CampsiteLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                if (state is CampsiteError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                        const SizedBox(height: 16),
                        Text(state.message),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<CampsiteBloc>().add(const LoadCampsites());
                          },
                          child: const Text('重试'),
                        ),
                      ],
                    ),
                  );
                }
                
                if (state is CampsiteLoaded) {
                  if (state.campsites.isEmpty) {
                    return const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off, size: 48, color: AppColors.textHint),
                          SizedBox(height: 16),
                          Text('暂无营地', style: TextStyle(color: AppColors.textSecondary)),
                        ],
                      ),
                    );
                  }
                  
                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: state.campsites.length,
                    itemBuilder: (context, index) {
                      final campsite = state.campsites[index];
                      return _CampsiteCard(
                        campsite: campsite,
                        onTap: () {
                          context.router.push(CampsiteDetailRoute(id: campsite.id));
                        },
                      );
                    },
                  );
                }
                
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
    );
  }
  
  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('筛选条件', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            const Text('充电设施'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(label: const Text('全部'), selected: true, onSelected: (_) {}),
                FilterChip(label: const Text('有充电桩'), selected: false, onSelected: (_) {}),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('重置'))),
                const SizedBox(width: 16),
                Expanded(child: ElevatedButton(onPressed: () {}, child: const Text('应用'))),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  String _getCountryCode(String country) {
    const codes = {
      '哈萨克斯坦': 'KZ',
      '老挝': 'LK',
      '巴基斯坦': 'PK',
      '俄罗斯': 'RU',
      '蒙古': 'MN',
    };
    return codes[country] ?? '';
  }
}

class _CampsiteCard extends StatelessWidget {
  final CampsiteModel campsite;
  final VoidCallback onTap;
  
  const _CampsiteCard({required this.campsite, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // 图片
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 100,
                  height: 100,
                  color: AppColors.primary.withOpacity(0.1),
                  child: campsite.images.isNotEmpty
                      ? Image.network(campsite.images.first, fit: BoxFit.cover)
                      : const Center(child: Icon(Icons.landscape, size: 40, color: AppColors.primary)),
                ),
              ),
              const SizedBox(width: 12),
              
              // 信息
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      campsite.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.location_on, size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            campsite.countryName,
                            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        if (campsite.chargingSpots > 0) ...[
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.ev_station, size: 12, color: AppColors.primary),
                                const SizedBox(width: 4),
                                Text(
                                  '${campsite.chargingSpots}桩',
                                  style: const TextStyle(fontSize: 10, color: AppColors.primary),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                        ],
                        if (campsite.rating > 0) ...[
                          const Icon(Icons.star, size: 14, color: Colors.amber),
                          const SizedBox(width: 4),
                          Text(
                            campsite.rating.toStringAsFixed(1),
                            style: const TextStyle(fontSize: 12),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '¥${(campsite.priceUsdCents / 100).toStringAsFixed(0)}/晚',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}