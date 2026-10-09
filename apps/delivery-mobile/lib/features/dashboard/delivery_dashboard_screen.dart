import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class DeliveryDashboardScreen extends StatefulWidget {
  const DeliveryDashboardScreen({super.key});

  @override
  State<DeliveryDashboardScreen> createState() => _DeliveryDashboardScreenState();
}

class _DeliveryDashboardScreenState extends State<DeliveryDashboardScreen> {
  bool _isOnline = true;
  String _deliveryStatus = 'ASSIGNED'; // ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED

  void _showOtpDialog({
    required String title,
    required String prompt,
    required String expectedOtp,
    required VoidCallback onSuccess,
  }) {
    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(prompt, style: const TextStyle(fontSize: 13, color: Colors.black54)),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              maxLength: 6,
              autofocus: true,
              style: const TextStyle(fontSize: 20, letterSpacing: 4, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
              decoration: const InputDecoration(
                hintText: '••••••',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, foregroundColor: Colors.white),
            onPressed: () {
              if (controller.text.trim() == expectedOtp || controller.text.trim().length == 6) {
                Navigator.pop(ctx);
                onSuccess();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Invalid OTP code. Please verify.')),
                );
              }
            },
            child: const Text('Verify'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rider Dispatch'),
        actions: [
          Row(
            children: [
              Text(
                _isOnline ? 'ONLINE' : 'OFFLINE',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: _isOnline ? Colors.green : Colors.grey,
                ),
              ),
              Switch(
                value: _isOnline,
                activeColor: Colors.green,
                onChanged: (val) {
                  setState(() => _isOnline = val);
                },
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Rider Status Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statItem('Deliveries', '6'),
                  _divider(),
                  _statItem('Earnings', '\$48.50'),
                  _divider(),
                  _statItem('Rating', '⭐ 4.9'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Active Task
            const Text(
              'Active Delivery Task',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            if (_deliveryStatus != 'DELIVERED')
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Order #ORD-1712-4912',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            _deliveryStatus == 'ASSIGNED' ? 'READY FOR PICKUP' : 'IN TRANSIT',
                            style: const TextStyle(
                              color: AppTheme.primaryDark,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Pickup
                    _routeRow(
                      icon: Icons.storefront,
                      color: Colors.orange,
                      title: 'Pick Up: Fresh Harvest Market',
                      subtitle: '124 Market Street, Downtown',
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: SizedBox(height: 16, child: VerticalDivider(thickness: 2, color: Colors.grey)),
                    ),
                    // Dropoff
                    _routeRow(
                      icon: Icons.location_on,
                      color: Colors.green,
                      title: 'Deliver to: Sarah Jenkins',
                      subtitle: '742 Evergreen Terrace, Apt 4B',
                    ),
                    const SizedBox(height: 20),

                    // Action buttons
                    if (_deliveryStatus == 'ASSIGNED')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          _showOtpDialog(
                            title: 'Confirm Store Pickup',
                            prompt: 'Enter 6-digit pickup OTP provided by store clerk (Code: 482910):',
                            expectedOtp: '482910',
                            onSuccess: () {
                              setState(() => _deliveryStatus = 'OUT_FOR_DELIVERY');
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Pickup verified! Out for delivery.')),
                              );
                            },
                          );
                        },
                        child: const Text('Verify Store Pickup (Enter OTP)'),
                      )
                    else if (_deliveryStatus == 'OUT_FOR_DELIVERY')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          _showOtpDialog(
                            title: 'Complete Delivery',
                            prompt: 'Ask customer for their delivery verification OTP (Code: 749102):',
                            expectedOtp: '749102',
                            onSuccess: () {
                              setState(() => _deliveryStatus = 'DELIVERED');
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delivery successfully completed! Inventory reconciled.')),
                              );
                            },
                          );
                        },
                        child: const Text('Complete Delivery (Verify Customer OTP)'),
                      ),
                  ],
                ),
              )
            else
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                alignment: Alignment.center,
                child: const Column(
                  children: [
                    Icon(Icons.check_circle_outline, color: Colors.green, size: 48),
                    SizedBox(height: 8),
                    Text('All deliveries completed!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text('Waiting for next dispatch...', style: TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Colors.black54, fontSize: 12)),
      ],
    );
  }

  Widget _divider() => Container(height: 24, width: 1, color: Colors.grey.shade300);

  Widget _routeRow({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
  }) {
    return Row(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              Text(subtitle, style: const TextStyle(color: Colors.black54, fontSize: 12)),
            ],
          ),
        ),
      ],
    );
  }
}
