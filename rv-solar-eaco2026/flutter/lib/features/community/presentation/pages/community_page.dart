/**
 * 社区页面
 */
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

@RoutePage()
class CommunityPage extends StatelessWidget {
  const CommunityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('社区'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => _showContributionSheet(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 贡献入口
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '贡献内容赢EACO',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '分享旅途、路况、营地信息',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => _showContributionSheet(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.primary,
                    ),
                    child: const Text('发布'),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // 贡献类型
            const Text(
              '贡献类型',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _ContributionTypeCard(icon: Icons.camera_alt, title: '路况拍照', reward: '500-2000', color: Colors.blue)),
                const SizedBox(width: 12),
                Expanded(child: _ContributionTypeCard(icon: Icons.description, title: '信息纠错', reward: '200-500', color: Colors.green)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _ContributionTypeCard(icon: Icons.place, title: '新营地发现', reward: '1000-3000', color: Colors.orange)),
                const SizedBox(width: 12),
                Expanded(child: _ContributionTypeCard(icon: Icons.article, title: '攻略分享', reward: '500-2000', color: Colors.purple)),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // 大使招募
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.accent.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.accent.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.star, color: AppColors.accent),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '招募口岸大使',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '成为首批5G基础设施贡献者',
                              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _showAmbassadorSheet(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                      ),
                      child: const Text('申请成为大使'),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // 热门内容
            const Text(
              '热门贡献',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _ContributionCard(
              avatar: '🌍',
              nickname: '旅行者A',
              time: '2小时前',
              type: '路况拍照',
              content: '霍尔果斯口岸目前排队车辆较少，通行顺畅。预计等待时间约30分钟。',
              location: '哈萨克斯坦·霍尔果斯',
              upvotes: 42,
            ),
            _ContributionCard(
              avatar: '☀️',
              nickname: '阳光rv',
              time: '5小时前',
              type: '营地发现',
              content: '发现一个绝佳的光伏营地！老板人很好，支持EACO支付。充电桩功率稳定在3kW左右。',
              location: '老挝·磨丁',
              upvotes: 38,
            ),
          ],
        ),
      ),
    );
  }
  
  void _showContributionSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '发布贡献',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            const Text('贡献类型'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                ChoiceChip(label: const Text('路况拍照'), selected: true, onSelected: (_) {}),
                ChoiceChip(label: const Text('信息纠错'), selected: false, onSelected: (_) {}),
                ChoiceChip(label: const Text('新营地'), selected: false, onSelected: (_) {}),
                ChoiceChip(label: const Text('攻略'), selected: false, onSelected: (_) {}),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: '描述你的贡献内容...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('添加图片'),
                ),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('贡献已提交，等待审核')),
                  );
                },
                child: const Text('提交'),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  void _showAmbassadorSheet(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('申请成为口岸大使'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('选择您想申请的口岸：'),
            SizedBox(height: 16),
            Text('• 哈萨克斯坦霍尔果斯 (试点中)'),
            Text('• 老挝磨丁'),
            Text('• 巴基斯坦红其拉甫'),
            Text('• 俄罗斯外贝加尔斯克'),
            Text('• 蒙古扎门乌德'),
            SizedBox(height: 16),
            Text(
              '大使特权：',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text('• 专属EACO奖励'),
            Text('• 优先体验新功能'),
            Text('• 社区荣誉标识'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('申请已提交，请等待审核')),
              );
            },
            child: const Text('申请'),
          ),
        ],
      ),
    );
  }
}

class _ContributionTypeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String reward;
  final Color color;
  
  const _ContributionTypeCard({
    required this.icon,
    required this.title,
    required this.reward,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(
            '$reward EACO',
            style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

class _ContributionCard extends StatelessWidget {
  final String avatar;
  final String nickname;
  final String time;
  final String type;
  final String content;
  final String location;
  final int upvotes;
  
  const _ContributionCard({
    required this.avatar,
    required this.nickname,
    required this.time,
    required this.type,
    required this.content,
    required this.location,
    required this.upvotes,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(avatar, style: const TextStyle(fontSize: 24)),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(nickname, style: const TextStyle(fontWeight: FontWeight.w600)),
                      Text(time, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(type, style: const TextStyle(fontSize: 12, color: AppColors.primary)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(content),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(location, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.thumb_up_outlined, size: 16, color: Colors.grey.shade600),
                const SizedBox(width: 4),
                Text('$upvotes', style: const TextStyle(fontSize: 12)),
                const Spacer(),
                const Icon(Icons.comment_outlined, size: 16),
                const SizedBox(width: 4),
                const Text('回复', style: TextStyle(fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}