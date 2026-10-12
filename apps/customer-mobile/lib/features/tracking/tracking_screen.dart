import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class TrackingScreen extends StatelessWidget {
  final String orderNumber;
  final String deliveryOtp;

  const TrackingScreen({
    super.key,
    this.orderNumber = 'ORD-1712-4912',
    this.deliveryOtp = '749102',
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Track #$orderNumber',
          style: const TextStyle(fontWeight: FontWeight.w800, color: AppTheme.navy),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ETA & OTP Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFE6F6EF),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0x3300A86B)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Estimated Arrival',
                        style: TextStyle(color: Color(0xFF008653), fontSize: 12, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        '~15 Mins',
                        style: TextStyle(color: AppTheme.navy, fontSize: 22, fontWeight: FontWeight.w900),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'Delivery OTP',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.primary),
                        ),
                        child: Text(
                          deliveryOtp,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2.5,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Live GPS Status Container
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.coolGray),
                boxShadow: const [
                  BoxShadow(color: Color(0x0A04284A), blurRadius: 8, offset: Offset(0, 2)),
                ],
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.two_wheeler, size: 36, color: AppTheme.primary),
                  SizedBox(height: 8),
                  Text(
                    'Rider is en route (1.2 km away)',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppTheme.navy),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Alex Mercer • Motorbike (BA-02-PA-8821)',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Steps
            const Text(
              'Delivery Stepper',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.navy),
            ),
            const SizedBox(height: 16),
            _stepTile(icon: Icons.check_circle, title: 'Order Confirmed', subtitle: 'Payment verified', isDone: true),
            _stepTile(icon: Icons.store, title: 'Store Packed Items', subtitle: 'Fresh Harvest Market Hub', isDone: true),
            _stepTile(icon: Icons.delivery_dining, title: 'Rider Out for Delivery', subtitle: 'On the way to your address', isDone: true),
            _stepTile(icon: Icons.home, title: 'Delivered', subtitle: 'Verify OTP on doorstep handover', isDone: false),
          ],
        ),
      ),
    );
  }

  Widget _stepTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool isDone,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: isDone ? const Color(0xFFE6F6EF) : AppTheme.coolGray,
            child: Icon(icon, size: 18, color: isDone ? AppTheme.secondary : AppTheme.textSecondary),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                  color: isDone ? AppTheme.navy : AppTheme.textSecondary,
                ),
              ),
              Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}
