/**
 * 认证仓储实现
 */
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/network/api_config.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/models/user_model.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  
  AuthRepositoryImpl(this._remoteDataSource);
  
  @override
  Future<bool> hasValidToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(ApiConfig.accessTokenKey) != null;
  }
  
  @override
  Future<UserModel> sendCode(String phoneCode, String phoneNumber) async {
    final data = await _remoteDataSource.sendCode(phoneCode, phoneNumber);
    if (data['code'] != 0) {
      throw Exception(data['message']);
    }
    return UserModel.fromJson(data['data']['user'] ?? {});
  }
  
  @override
  Future<UserModel> verifyCode(String phoneCode, String phoneNumber, String code) async {
    final data = await _remoteDataSource.verifyCode(phoneCode, phoneNumber, code);
    if (data['code'] != 0) {
      throw Exception(data['message']);
    }
    
    // 保存Token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(ApiConfig.accessTokenKey, data['data']['access_token']);
    await prefs.setString(ApiConfig.refreshTokenKey, data['data']['refresh_token']);
    
    return UserModel.fromJson(data['data']['user']);
  }
  
  @override
  Future<UserModel> getCurrentUser() async {
    final data = await _remoteDataSource.getCurrentUser();
    if (data['code'] != 0) {
      throw Exception(data['message']);
    }
    return UserModel.fromJson(data['data']);
  }
  
  @override
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(ApiConfig.accessTokenKey);
    await prefs.remove(ApiConfig.refreshTokenKey);
  }
}