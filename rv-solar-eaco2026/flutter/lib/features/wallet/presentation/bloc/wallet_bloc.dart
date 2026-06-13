/**
 * 钱包Bloc
 */
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/repositories/wallet_repository.dart';

part 'wallet_event.dart';
part 'wallet_state.dart';

class WalletBloc extends Bloc<WalletEvent, WalletState> {
  final WalletRepository _repository;
  
  WalletBloc(this._repository) : super(WalletInitial()) {
    on<LoadWallet>(_onLoadWallet);
  }
  
  Future<void> _onLoadWallet(
    LoadWallet event,
    Emitter<WalletState> emit,
  ) async {
    emit(WalletLoading());
    try {
      final wallet = await _repository.getWallet();
      emit(WalletLoaded(
        address: wallet['address'],
        eacoBalance: (wallet['eaco_balance'] ?? 0).toDouble(),
        usdtBalance: (wallet['usdt_balance'] ?? 0).toDouble(),
        usdcBalance: (wallet['usdc_balance'] ?? 0).toDouble(),
        solBalance: (wallet['sol_balance'] ?? 0).toDouble(),
      ));
    } catch (e) {
      emit(WalletError(message: e.toString()));
    }
  }
}