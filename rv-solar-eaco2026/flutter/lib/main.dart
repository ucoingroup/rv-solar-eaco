/**
 * RV Solar EACO - Flutter APP 主入口
 */
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/di/injection.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/campsite/presentation/bloc/campsite_bloc.dart';
import 'features/charging/presentation/bloc/charging_bloc.dart';
import 'features/wallet/presentation/bloc/wallet_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 状态栏样式
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  
  // 初始化依赖注入
  await initDependencies();
  
  runApp(const RVSolarEACOApp());
}

class RVSolarEACOApp extends StatelessWidget {
  const RVSolarEACOApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => GetIt.I<AuthBloc>()..add(AuthCheckRequested()),
        ),
        BlocProvider<CampsiteBloc>(
          create: (_) => GetIt.I<CampsiteBloc>(),
        ),
        BlocProvider<ChargingBloc>(
          create: (_) => GetIt.I<ChargingBloc>(),
        ),
        BlocProvider<WalletBloc>(
          create: (_) => GetIt.I<WalletBloc>(),
        ),
      ],
      child: MaterialApp.router(
        title: 'RV Solar EACO',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: AppRouter.router,
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('en', 'US'),
          Locale('zh', 'CN'),
        ],
      ),
    );
  }
}