class OrderModel {
  final String time;
  final String client;
  final String ticker;
  final String side;
  final String product;
  final String quantity;
  final String price;
  final bool hasInfo;

  OrderModel({
    required this.time,
    required this.client,
    required this.ticker,
    required this.side,
    required this.product,
    required this.quantity,
    required this.price,
    this.hasInfo = false,
  });

  static List<OrderModel> getSampleOrders() {
    return [
      OrderModel(
        time: '08:14:31',
        client: 'AAA001',
        ticker: 'RELIANCE',
        side: 'Buy',
        product: 'CNC',
        quantity: '50/100',
        price: '250.50',
        hasInfo: true,
      ),
      OrderModel(
        time: '08:14:31',
        client: 'AAA003',
        ticker: 'MRF',
        side: 'Buy',
        product: 'NRML',
        quantity: '10/20',
        price: '2,700.00',
      ),
      OrderModel(
        time: '08:14:31',
        client: 'AAA002',
        ticker: 'ASIANPAINT',
        side: 'Buy',
        product: 'NRML',
        quantity: '10/30',
        price: '1,500.60',
        hasInfo: true,
      ),
      OrderModel(
        time: '08:14:31',
        client: 'AAA002',
        ticker: 'TATAINVEST',
        side: 'Sell',
        product: 'INTRADAY',
        quantity: '10/10',
        price: '2,300.10',
      ),
      OrderModel(
        time: '08:15:22',
        client: 'AAA001',
        ticker: 'HDFC',
        side: 'Buy',
        product: 'CNC',
        quantity: '25/50',
        price: '1,650.75',
      ),
      OrderModel(
        time: '08:16:45',
        client: 'AAA003',
        ticker: 'INFY',
        side: 'Sell',
        product: 'NRML',
        quantity: '15/15',
        price: '1,420.30',
      ),
    ];
  }
}