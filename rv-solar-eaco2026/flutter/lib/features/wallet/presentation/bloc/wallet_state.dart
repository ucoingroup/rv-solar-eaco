part of 'wallet_bloc.dart';

abstract class WalletState extends Equatable {
  const WalletState();
  
  @override
  List<Object?> get props => [];
}

class WalletInitial extends WalletState {}

class WalletLoading extends WalletState {}

class WalletLoaded extends WalletState {
  final String address;
  final double eacoBalance;
  final double usdtBalance;
  final double usdcBalance;
  final double solBalance;
  
  const WalletLoaded({
    required this.address,
    required this.eacoBalance,
    required this.usdtBalance,
    required this.usdcBalance,
    required this.solBalance,
  });
  
  @override
  List<Object?> get props => [address, eacoBalance, usdtBalance, usdcBalance, solBalance];
}

class WalletError extends WalletState {
  final String message;
  
  const WalletError({required this.message});
  
  @override
  List<Object?> get props => [message];
}