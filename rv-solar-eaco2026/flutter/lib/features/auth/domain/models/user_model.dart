/**
 * 用户模型
 */
class UserModel {
  final String id;
  final String phoneCode;
  final String phoneNumber;
  final String? nickname;
  final String? avatarUrl;
  final String walletAddress;
  final int userLevel;
  final String language;
  final String kycStatus;
  final double totalEnergyKwh;
  final int totalRewardEaco;
  final DateTime createdAt;
  
  UserModel({
    required this.id,
    required this.phoneCode,
    required this.phoneNumber,
    this.nickname,
    this.avatarUrl,
    required this.walletAddress,
    required this.userLevel,
    required this.language,
    required this.kycStatus,
    required this.totalEnergyKwh,
    required this.totalRewardEaco,
    required this.createdAt,
  });
  
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      phoneCode: json['phone_code'] ?? '+86',
      phoneNumber: json['phone_number'] ?? '',
      nickname: json['nickname'],
      avatarUrl: json['avatar_url'],
      walletAddress: json['wallet_address'] ?? '',
      userLevel: json['user_level'] ?? 1,
      language: json['language'] ?? 'zh',
      kycStatus: json['kyc_status'] ?? 'none',
      totalEnergyKwh: (json['total_energy_kwh'] ?? 0).toDouble(),
      totalRewardEaco: json['total_reward_eaco'] ?? 0,
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
  
  Map<String, dynamic> toJson() => {
    'id': id,
    'phone_code': phoneCode,
    'phone_number': phoneNumber,
    'nickname': nickname,
    'avatar_url': avatarUrl,
    'wallet_address': walletAddress,
    'user_level': userLevel,
    'language': language,
    'kyc_status': kycStatus,
    'total_energy_kwh': totalEnergyKwh,
    'total_reward_eaco': totalRewardEaco,
    'created_at': createdAt.toIso8601String(),
  };
}