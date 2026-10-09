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
        title: Text('Track #$orderNumber'),
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
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Estimated Arrival',
                        style: TextStyle(color: Colors.green.shade800, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '~15 Mins',
                        style: TextStyle(color: Colors.green.shade900, fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'Delivery OTP',
                        style: TextStyle(color: Colors.black54, fontSize: 11),
                      ),
                      const SizedBox(height: 2),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Text(
                          deliveryOtp,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Live GPS Status
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, size: 36, color: Colors.black54),
                  SizedBox(height: 6),
                  Text('Rider is on the way (1.2 km away)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('Alex Mercer • Motorbike (KA-03-HA-8821)', style: TextStyle(color: Colors.black54, fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Steps
            const Text('Delivery Progress', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _stepTile(icon: Icons.check_circle, title: 'Order Confirmed', subtitle: 'Payment verified', isDone: true),
            _stepTile(icon: Icons.store, title: 'Store Packed Items', subtitle: 'Fresh Harvest Market', isDone: true),
            _stepTile(icon: Icons.two_wheeler, title: 'Rider Out for Delivery', subtitle: 'On the way to your door', isDone: true),
            _stepTile(icon: Icons.home, title: 'Delivered', subtitle: 'Share OTP on arrival', isDone: false),
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
            backgroundColor: isDone ? AppTheme.primary.withOpacity(0.15) : Colors.grey.shade200,
            child: Icon(icon, size: 18, color: isDone ? AppTheme.primaryDark : Colors.grey),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: isDone ? Colors.black87 : Colors.grey,
                ),
              ),
              Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.black54)),
            ],
          ),
        ],
      ),
    );
  }
}
