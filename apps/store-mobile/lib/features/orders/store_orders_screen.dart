import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class StoreOrdersScreen extends StatefulWidget {
  const StoreOrdersScreen({super.key});

  @override
  State<StoreOrdersScreen> createState() => _StoreOrdersScreenState();
}

class _StoreOrdersScreenState extends State<StoreOrdersScreen> {
  final List<Map<String, dynamic>> _orders = [
    {
      'id': 'ord-1',
      'orderNumber': 'ORD-1712-4912',
      'items': 'Organic Bananas (2x), Farm Fresh Milk (1x)',
      'total': 17.26,
      'status': 'PREPARING',
      'pickupOtp': '482910',
      'riderName': 'Alex Mercer (Motorbike)',
    },
    {
      'id': 'ord-2',
      'orderNumber': 'ORD-1712-5034',
      'items': 'Honeycrisp Apples (1x), Rustic Sourdough (1x)',
      'total': 14.96,
      'status': 'CONFIRMED',
      'pickupOtp': '619384',
      'riderName': null,
    },
  ];

  void _advanceOrder(int index) {
    setState(() {
      final current = _orders[index]['status'];
      if (current == 'CONFIRMED') {
        _orders[index]['status'] = 'PREPARING';
      } else if (current == 'PREPARING') {
        _orders[index]['status'] = 'READY_FOR_PICKUP';
      } else if (current == 'READY_FOR_PICKUP') {
        _orders[index]['status'] = 'ASSIGNED';
      }
    });
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
                color: AppTheme.secondary,
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
              'Store Merchant Hub',
              style: TextStyle(fontWeight: FontWeight.w800, color: AppTheme.navy, fontSize: 17),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppTheme.navy),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: _orders.length,
        itemBuilder: (context, index) {
          final order = _orders[index];
          final status = order['status'] as String;

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: AppTheme.coolGray),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        order['orderNumber'],
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.navy),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: status == 'CONFIRMED'
                              ? const Color(0xFFFFF0E5)
                              : const Color(0xFFE6F6EF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          status.replaceAll('_', ' '),
                          style: TextStyle(
                            color: status == 'CONFIRMED' ? AppTheme.primary : AppTheme.secondary,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    order['items'],
                    style: const TextStyle(color: AppTheme.navy, fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 12),
                  const Divider(color: AppTheme.coolGray),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Store Pickup OTP', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 2),
                          Text(
                            order['pickupOtp'],
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: AppTheme.secondary,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => _advanceOrder(index),
                        child: Text(
                          status == 'CONFIRMED'
                              ? 'Start Prep →'
                              : status == 'PREPARING'
                                  ? 'Mark Ready →'
                                  : 'Handover',
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
