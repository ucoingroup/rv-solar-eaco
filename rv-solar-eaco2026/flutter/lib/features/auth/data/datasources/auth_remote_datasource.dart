/**
 * 认证远程数据源
 */
import '../../../../core/network/api_client.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> sendCode(String phoneCode, String phoneNumber);
  Future<Map<String, dynamic>> verifyCode(String phoneCode, String phoneNumber, String code);
  Future<Map<String, dynamic>> getCurrentUser();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _apiClient;
  
  AuthRemoteDataSourceImpl(this._apiClient);
  
  @override
  Future<Map<String, dynamic>> sendCode(String phoneCode, String phoneNumber) async {
    final response = await _apiClient.post('/auth/send-code', data: {
      'phone_code': phoneCode,
      'phone_number': phoneNumber,
    });
    return response.data;
  }
  
  @override
  Future<Map<String, dynamic>> verifyCode(String phoneCode, String phoneNumber, String code) async {
    final response = await _apiClient.post('/auth/verify-code', data: {
      'phone_code': phoneCode,
      'phone_number': phoneNumber,
      'code': code,
    });
    return response.data;
  }
  
  @override
  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await _apiClient.get('/users/me');
    return response.data;
  }
}