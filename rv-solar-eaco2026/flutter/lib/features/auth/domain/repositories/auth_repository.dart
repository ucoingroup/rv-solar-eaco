/**
 * 认证仓储接口
 */
import '../models/user_model.dart';

abstract class AuthRepository {
  Future<bool> hasValidToken();
  Future<UserModel> sendCode(String phoneCode, String phoneNumber);
  Future<UserModel> verifyCode(String phoneCode, String phoneNumber, String code);
  Future<UserModel> getCurrentUser();
  Future<void> logout();
}