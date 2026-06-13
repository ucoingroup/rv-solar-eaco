/**
 * 路由配置
 */
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/campsite/presentation/pages/campsite_list_page.dart';
import '../../features/campsite/presentation/pages/campsite_detail_page.dart';
import '../../features/charging/presentation/pages/charging_page.dart';
import '../../features/wallet/presentation/pages/wallet_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/community/presentation/pages/community_page.dart';
import 'main_page.dart';

part 'app_router.gr.dart';

@AutoRouterConfig(replaceInRouteName: 'Page,Route')
class AppRouter extends _$AppRouter {
  @override
  List<AutoRoute> get routes => [
        AutoRoute(page: SplashRoute.page, initial: true),
        AutoRoute(page: LoginRoute.page),
        AutoRoute(
          page: MainRoute.page,
          children: [
            AutoRoute(page: HomeRoute.page),
            AutoRoute(page: CampsiteListRoute.page),
            AutoRoute(page: WalletRoute.page),
            AutoRoute(page: CommunityRoute.page),
            AutoRoute(page: ProfileRoute.page),
          ],
        ),
        AutoRoute(page: CampsiteDetailRoute.page),
        AutoRoute(page: ChargingRoute.page),
      ];
}
