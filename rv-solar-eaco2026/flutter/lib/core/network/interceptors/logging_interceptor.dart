/**
 * 日志拦截器
 */
import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

class LoggingInterceptor extends Interceptor {
  final _logger = Logger();
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    _logger.d('API Request: ${options.method} ${options.uri}');
    if (options.data != null) {
      _logger.d('Request Data: ${options.data}');
    }
    handler.next(options);
  }
  
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _logger.d('API Response: ${response.statusCode} ${response.requestOptions.uri}');
    handler.next(response);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _logger.e('API Error: ${err.type} ${err.requestOptions.uri}');
    _logger.e('Error Message: ${err.message}');
    handler.next(err);
  }
}