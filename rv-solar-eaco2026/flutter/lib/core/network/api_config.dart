/**
 * API配置
 */
class ApiConfig {
  static const String baseUrl = 'https://api.rv-solar-eaco.com/v1';
  static const String wsUrl = 'wss://ws.rv-solar-eaco.com';
  
  // 超时配置
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // API版本
  static const String apiVersion = 'v1';
  
  // 存储Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String languageKey = 'language';
}