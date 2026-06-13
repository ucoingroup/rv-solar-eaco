/**
 * 认证拦截器
 */
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api_config.dart';

class AuthInterceptor extends Interceptor {
  final SharedPreferences _prefs;
  
  AuthInterceptor(this._prefs);
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _prefs.getString(ApiConfig.accessTokenKey);
    
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    handler.next(options);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token过期，触发刷新或重新登录
      _prefs.remove(ApiConfig.accessTokenKey);
      _prefs.remove(ApiConfig.refreshTokenKey);
    }
    
    handler.next(err);
  }
}