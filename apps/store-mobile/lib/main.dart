import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/orders/store_orders_screen.dart';

void main() {
  runApp(const GroceryStoreMerchantApp());
}

class GroceryStoreMerchantApp extends StatelessWidget {
  const GroceryStoreMerchantApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshCart Store Merchant',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const StoreOrdersScreen(),
    );
  }
}
