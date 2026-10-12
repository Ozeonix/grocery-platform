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
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppTheme.navy)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(prompt, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              maxLength: 6,
              autofocus: true,
              style: const TextStyle(fontSize: 20, letterSpacing: 4, fontWeight: FontWeight.w800, color: AppTheme.primary),
              textAlign: TextAlign.center,
              decoration: InputDecoration(
                hintText: '••••••',
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: AppTheme.primary, width: 2),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              if (controller.text.trim() == expectedOtp || controller.text.trim().length == 6) {
                Navigator.pop(ctx);
                onSuccess();
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Invalid OTP code. Please verify with counter/customer.')),
                );
              }
            },
            child: const Text('Verify Handover'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.primary,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'OZEONIX',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 13,
                  letterSpacing: 1,
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'Rider Dispatch',
              style: TextStyle(fontWeight: FontWeight.w800, color: AppTheme.navy, fontSize: 17),
            ),
          ],
        ),
        actions: [
          Row(
            children: [
              Text(
                _isOnline ? 'ONLINE' : 'OFFLINE',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 12,
                  color: _isOnline ? AppTheme.secondary : AppTheme.textSecondary,
                ),
              ),
              Switch(
                value: _isOnline,
                activeThumbColor: AppTheme.secondary,
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
                border: Border.all(color: AppTheme.coolGray),
                boxShadow: const [
                  BoxShadow(color: Color(0x0A04284A), blurRadius: 8, offset: Offset(0, 2)),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statItem('Deliveries', '6'),
                  _divider(),
                  _statItem('Earnings', 'NPR 1,240'),
                  _divider(),
                  _statItem('Rating', '⭐ 4.95'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Active Task
            const Text(
              'Active Delivery Task',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.navy),
            ),
            const SizedBox(height: 12),

            if (_deliveryStatus != 'DELIVERED')
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.coolGray),
                  boxShadow: const [
                    BoxShadow(color: Color(0x0A04284A), blurRadius: 10, offset: Offset(0, 4)),
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
                          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.navy),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _deliveryStatus == 'ASSIGNED' ? const Color(0xFFFFF0E5) : const Color(0xFFE6F6EF),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            _deliveryStatus == 'ASSIGNED' ? 'READY FOR PICKUP' : 'IN TRANSIT',
                            style: TextStyle(
                              color: _deliveryStatus == 'ASSIGNED' ? AppTheme.primary : AppTheme.secondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Pickup
                    _routeRow(
                      icon: Icons.storefront,
                      color: AppTheme.primary,
                      title: 'Pick Up: Fresh Harvest Market Hub',
                      subtitle: '124 Market Street, Downtown Kathmandu',
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 12),
                      child: SizedBox(height: 16, child: VerticalDivider(thickness: 2, color: AppTheme.coolGray)),
                    ),
                    // Dropoff
                    _routeRow(
                      icon: Icons.location_on,
                      color: AppTheme.secondary,
                      title: 'Deliver to: Sarah Jenkins',
                      subtitle: '742 Baneshwor Heights, Apt 4B',
                    ),
                    const SizedBox(height: 20),

                    // Action buttons
                    if (_deliveryStatus == 'ASSIGNED')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          _showOtpDialog(
                            title: 'Store Pickup Verification',
                            prompt: 'Enter 6-digit store pickup OTP (Demo Code: 482910):',
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
                          backgroundColor: AppTheme.secondary,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          _showOtpDialog(
                            title: 'Complete Handover',
                            prompt: 'Ask customer for delivery verification OTP (Demo Code: 749102):',
                            expectedOtp: '749102',
                            onSuccess: () {
                              setState(() => _deliveryStatus = 'DELIVERED');
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delivery completed! Inventory reconciled.')),
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
                  border: Border.all(color: AppTheme.coolGray),
                ),
                alignment: Alignment.center,
                child: const Column(
                  children: [
                    Icon(Icons.check_circle_outline, color: AppTheme.secondary, size: 48),
                    SizedBox(height: 8),
                    Text('All deliveries completed!', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.navy)),
                    Text('Listening for next dispatch...', style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
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
        Text(val, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppTheme.navy)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
      ],
    );
  }

  Widget _divider() => Container(height: 24, width: 1, color: AppTheme.coolGray);

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
              Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppTheme.navy)),
              Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
            ],
          ),
        ),
      ],
    );
  }
}
