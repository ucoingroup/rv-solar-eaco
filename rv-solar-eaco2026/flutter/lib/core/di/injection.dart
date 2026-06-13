/**
 * 依赖注入配置
 */
import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/campsite/data/datasources/campsite_remote_datasource.dart';
import '../../features/campsite/data/repositories/campsite_repository_impl.dart';
import '../../features/campsite/domain/repositories/campsite_repository.dart';
import '../../features/campsite/presentation/bloc/campsite_bloc.dart';
import '../../features/charging/data/datasources/charging_remote_datasource.dart';
import '../../features/charging/data/repositories/charging_repository_impl.dart';
import '../../features/charging/domain/repositories/charging_repository.dart';
import '../../features/charging/presentation/bloc/charging_bloc.dart';
import '../../features/wallet/data/datasources/wallet_remote_datasource.dart';
import '../../features/wallet/data/repositories/wallet_repository_impl.dart';
import '../../features/wallet/domain/repositories/wallet_repository.dart';
import '../../features/wallet/presentation/bloc/wallet_bloc.dart';
import '../network/api_client.dart';
import '../network/api_config.dart';
import '../network/interceptors/auth_interceptor.dart';
import '../network/interceptors/logging_interceptor.dart';

final getIt = GetIt.instance;

Future<void> initDependencies() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerSingleton<SharedPreferences>(sharedPreferences);
  
  final dio = Dio(BaseOptions(
    baseUrl: ApiConfig.baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ));
  
  dio.interceptors.addAll([
    AuthInterceptor(getIt()),
    LoggingInterceptor(),
  ]);
  
  getIt.registerSingleton<Dio>(dio);
  
  // API Client
  getIt.registerSingleton<ApiClient>(ApiClient(getIt()));
  
  // Data Sources
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(getIt()),
  );
  getIt.registerLazySingleton<CampsiteRemoteDataSource>(
    () => CampsiteRemoteDataSourceImpl(getIt()),
  );
  getIt.registerLazySingleton<ChargingRemoteDataSource>(
    () => ChargingRemoteDataSourceImpl(getIt()),
  );
  getIt.registerLazySingleton<WalletRemoteDataSource>(
    () => WalletRemoteDataSourceImpl(getIt()),
  );
  
  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(getIt()),
  );
  getIt.registerLazySingleton<CampsiteRepository>(
    () => CampsiteRepositoryImpl(getIt()),
  );
  getIt.registerLazySingleton<ChargingRepository>(
    () => ChargingRepositoryImpl(getIt()),
  );
  getIt.registerLazySingleton<WalletRepository>(
    () => WalletRepositoryImpl(getIt()),
  );
  
  // Blocs
  getIt.registerFactory<AuthBloc>(() => AuthBloc(getIt()));
  getIt.registerFactory<CampsiteBloc>(() => CampsiteBloc(getIt()));
  getIt.registerFactory<ChargingBloc>(() => ChargingBloc(getIt()));
  getIt.registerFactory<WalletBloc>(() => WalletBloc(getIt()));
}