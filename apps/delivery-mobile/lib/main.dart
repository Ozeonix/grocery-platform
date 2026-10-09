import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/dashboard/delivery_dashboard_screen.dart';

void main() {
  runApp(const GroceryDeliveryPartnerApp());
}

class GroceryDeliveryPartnerApp extends StatelessWidget {
  const GroceryDeliveryPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshCart Delivery Partner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const DeliveryDashboardScreen(),
    );
  }
}
