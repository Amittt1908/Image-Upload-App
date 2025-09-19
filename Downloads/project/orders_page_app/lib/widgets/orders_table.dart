import 'package:flutter/material.dart';
import '../utils/constants.dart';
import '../models/order_model.dart';

class OrdersTable extends StatefulWidget {
  final List<OrderModel> orders;
  
  const OrdersTable({super.key, required this.orders});

  @override
  State<OrdersTable> createState() => _OrdersTableState();
}

class _OrdersTableState extends State<OrdersTable> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.backgroundColor,
      drawer: _buildResponsiveDrawer(),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            bool isMobile = constraints.maxWidth < 600;
            bool isTablet = constraints.maxWidth >= 600 && constraints.maxWidth < 1000;
            
            return Column(
              children: [
                // Top Navigation Bar - Fully Responsive
                _buildTopNavigationBar(context, isMobile, isTablet),
                
                // Main Content - Fully Responsive
                Expanded(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: EdgeInsets.all(isMobile ? 12 : 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header - Responsive
                          _buildHeader(context, isMobile, isTablet),
                          
                          SizedBox(height: isMobile ? 16 : 24),
                          
                          // Main Container - Responsive
                          Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: AppColors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: EdgeInsets.all(isMobile ? 12 : 20),
                              child: Column(
                                children: [
                                  // Filter Bar - Responsive
                                  _buildFilterBar(context, isMobile, isTablet),
                                  
                                  SizedBox(height: isMobile ? 16 : 24),
                                  
                                  // Orders Table - Responsive
                                  SizedBox(
                                    height: isMobile ? 400 : 500,
                                    child: _buildOrdersTable(context, isMobile, isTablet),
                                  ),
                                  
                                  SizedBox(height: isMobile ? 16 : 20),
                                  
                                  // Pagination - Responsive
                                  _buildPagination(context, isMobile, isTablet),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildResponsiveDrawer() {
    return LayoutBuilder(
      builder: (context, constraints) {
        bool isTablet = constraints.maxWidth >= 600 && constraints.maxWidth < 1000;
        return isTablet ? _buildTabletDrawer() : _buildMobileDrawer();
      },
    );
  }

  Widget _buildTopNavigationBar(BuildContext context, bool isMobile, bool isTablet) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 8 : 24, 
        vertical: isMobile ? 8 : 16
      ),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(bottom: BorderSide(color: AppColors.lightGrey, width: 1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 2,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: isMobile ? _buildMobileTopNav() : _buildDesktopTopNav(isTablet),
    );
  }

  Widget _buildMobileTopNav() {
    return LayoutBuilder(
      builder: (context, constraints) {
        double screenWidth = constraints.maxWidth;
        
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Top navigation row
            SizedBox(
              height: 48,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // LEFT: Menu button
                  SizedBox(
                    width: 48,
                    height: 48,
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(24),
                        onTap: () => _scaffoldKey.currentState?.openDrawer(),
                        child: const Icon(Icons.menu, color: AppColors.darkGrey, size: 24),
                      ),
                    ),
                  ),
                  
                  // CENTER: Logo and app name
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: AppColors.orangeNeutral,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Icon(Icons.bar_chart, color: AppColors.white, size: 16),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Orders',
                          style: TextStyle(
                            fontSize: screenWidth < 350 ? 16 : 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.darkGrey,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // RIGHT: User profile
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2), width: 1),
                    ),
                    child: const Center(
                      child: Text('LK', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.primaryBlue)),
                    ),
                  ),
                ],
              ),
            ),
            
            // Divider
            Container(
              height: 1,
              margin: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.transparent, AppColors.lightGrey, Colors.transparent],
                ),
              ),
            ),
            
            // Stock tickers
            SizedBox(
              height: 36,
              child: Row(
                children: [
                  Container(
                    width: 12,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [AppColors.white, AppColors.white.withValues(alpha: 0)],
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      itemCount: 4,
                      itemBuilder: (context, index) {
                        final stockData = [
                          {'name': 'SIGNORIA', 'value': '0.00', 'change': '0.00%'},
                          {'name': 'NIFTY BANK', 'value': '52,323', 'change': '+0.15%'},
                          {'name': 'NIFTY FIN', 'value': '25,255', 'change': '+0.42%'},
                          {'name': 'RELCHEMQ', 'value': '162.73', 'change': '-0.28%'},
                        ];
                        return Container(
                          margin: const EdgeInsets.only(right: 8),
                          child: _buildMobileStockCard(
                            stockData[index]['name']!,
                            stockData[index]['value']!,
                            stockData[index]['change']!,
                          ),
                        );
                      },
                    ),
                  ),
                  Container(
                    width: 12,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerRight,
                        end: Alignment.centerLeft,
                        colors: [AppColors.white, AppColors.white.withValues(alpha: 0)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDesktopTopNav(bool isTablet) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: constraints.maxWidth),
            child: Row(
              children: [
                // Menu icon for tablet
                if (isTablet) ...[
                  IconButton(
                    onPressed: () => _scaffoldKey.currentState?.openDrawer(),
                    icon: Icon(Icons.menu, color: AppColors.darkGrey, size: isTablet ? 18 : 20),
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(),
                  ),
                  const SizedBox(width: 8),
                ],
                
                // Logo
                Container(
                  width: isTablet ? 28 : 32,
                  height: isTablet ? 18 : 20,
                  decoration: const BoxDecoration(color: AppColors.orangeNeutral),
                  child: Icon(Icons.bar_chart, color: AppColors.white, size: isTablet ? 12 : 14),
                ),
                const SizedBox(width: 16),
                
                // Stock tickers - fixed width to avoid constraints issues
                SizedBox(
                  width: 600, // Fixed width to prevent unbounded constraints
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildStockTicker('SIGNORIA', '0.00'),
                      const SizedBox(width: 16),
                      _buildStockTicker('NIFTY BANK', '52,323.30'),
                      const SizedBox(width: 16),
                      _buildStockTicker('NIFTY FIN SERVICE', '25,255.75'),
                      const SizedBox(width: 16),
                      _buildStockTicker('RELCHEMQ', '162.73'),
                    ],
                  ),
                ),
                
                const SizedBox(width: 16),
                
                // Navigation items - responsive
                if (!isTablet && constraints.maxWidth > 1200) ...[
                  const Text('MARKETWATCH', style: AppTextStyles.navBarStock),
                  const SizedBox(width: 16),
                  const Text('EXCHANGE FILES', style: AppTextStyles.navBarStock),
                  const SizedBox(width: 16),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('PORTFOLIO', style: AppTextStyles.navBarStock),
                      const SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_down, size: isTablet ? 14 : 16, color: AppColors.greyText),
                    ],
                  ),
                  const SizedBox(width: 16),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('FUNDS', style: AppTextStyles.navBarStock),
                      const SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_down, size: isTablet ? 14 : 16, color: AppColors.greyText),
                    ],
                  ),
                  const SizedBox(width: 16),
                ],
                
                // User profile
                Container(
                  width: isTablet ? 28 : 32,
                  height: isTablet ? 28 : 32,
                  decoration: BoxDecoration(
                    color: AppColors.lightGrey,
                    borderRadius: BorderRadius.circular(isTablet ? 14 : 16),
                  ),
                  child: Center(
                    child: Text('LK', style: TextStyle(fontSize: isTablet ? 11 : 12, fontWeight: FontWeight.w600)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStockTicker(String name, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(name, style: AppTextStyles.bodySmall.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(value, style: AppTextStyles.bodySmall.copyWith(color: AppColors.greyText)),
        ],
      ),
    );
  }

  Widget _buildMobileStockCard(String name, String value, String change) {
    Color changeColor = AppColors.greyText;
    if (change.startsWith('+')) changeColor = AppColors.greenPositive;
    if (change.startsWith('-')) changeColor = AppColors.redNegative;
    
    return Container(
      width: 70,
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.lightGrey.withValues(alpha: 0.3), width: 0.5),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 1, offset: const Offset(0, 0.5))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(name.length > 8 ? '${name.substring(0, 8)}.' : name, style: const TextStyle(fontSize: 7, fontWeight: FontWeight.w600, color: AppColors.darkGrey, height: 1.1), overflow: TextOverflow.ellipsis, maxLines: 1),
          Text(value, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w500, color: AppColors.darkGrey, height: 1.1), overflow: TextOverflow.ellipsis, maxLines: 1),
          Text(change, style: TextStyle(fontSize: 6, fontWeight: FontWeight.w500, color: changeColor, height: 1.1), overflow: TextOverflow.ellipsis, maxLines: 1),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, bool isMobile, bool isTablet) {
    if (isMobile) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Open Orders', style: AppTextStyles.headerLarge),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.download, size: isTablet ? 16 : 18),
              label: const Text('Download'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.lightGrey,
                foregroundColor: AppColors.darkGrey,
                elevation: 1,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6), side: const BorderSide(color: AppColors.lightGrey)),
              ),
            ),
          ),
        ],
      );
    } else {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Expanded(child: Text('Open Orders', style: AppTextStyles.headerLarge, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 16),
          ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.download, size: isTablet ? 16 : 18),
            label: const Text('Download'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.lightGrey,
              foregroundColor: AppColors.darkGrey,
              elevation: 1,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6), side: const BorderSide(color: AppColors.lightGrey)),
            ),
          ),
        ],
      );
    }
  }

  Widget _buildFilterBar(BuildContext context, bool isMobile, bool isTablet) {
    if (isMobile) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildMobileAccountSelector(),
          const SizedBox(height: 12),
          _buildMobileSearchBar(),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildMobileFilterChip('Lalit X'),
              const SizedBox(width: 8),
              _buildMobileFilterChip('RELIANCE'),
              const Spacer(),
              _buildMobileCancelButton(),
            ],
          ),
        ],
      );
    } else if (isTablet) {
      return Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildAccountSelector(),
              const SizedBox(width: 12),
              _buildFilterChip('Lalit X', isTablet),
              const SizedBox(width: 12),
              Expanded(child: _buildSearchBar(isTablet: isTablet)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildFilterChip('RELIANCE', isTablet),
              const SizedBox(width: 8),
              _buildFilterChip('ASIANPAINT', isTablet),
              const Spacer(),
              _buildCancelAllButton(isTablet),
            ],
          ),
        ],
      );
    } else {
      return LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: constraints.maxWidth),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Left side - all filter elements
                  Row(
                    children: [
                      _buildAccountSelector(),
                      const SizedBox(width: 12),
                      _buildFilterChip('Lalit X', isTablet),
                      const SizedBox(width: 12),
                      SizedBox(
                        width: isTablet ? 250 : 300, // Smaller width for tablet
                        child: _buildSearchBar(isTablet: isTablet),
                      ),
                      const SizedBox(width: 12),
                      _buildFilterChip('RELIANCE', isTablet),
                      const SizedBox(width: 8),
                      _buildFilterChip('ASIANPAINT', isTablet),
                    ],
                  ),
                  
                  // Right side - cancel button (will be pushed to extreme right)
                  _buildCancelAllButton(isTablet),
                ],
              ),
            ),
          );
        },
      );
    }
  }

  Widget _buildAccountSelector() {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.lightGrey),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            alignment: Alignment.center,
            child: const Text('AAA002', style: AppTextStyles.bodyMedium),
          ),
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.lightGrey,
              borderRadius: BorderRadius.only(topRight: Radius.circular(6), bottomRight: Radius.circular(6)),
            ),
            child: const Center(child: Icon(Icons.person_add, size: 16, color: AppColors.darkGrey)),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileAccountSelector() {
    return Container(
      width: double.infinity,
      height: 44,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.lightGrey),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  const Icon(Icons.account_circle_outlined, size: 20, color: AppColors.primaryBlue),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Account: AAA002', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.darkGrey)),
                      Text('Lalit Kumar', style: TextStyle(fontSize: 12, color: AppColors.greyText)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: AppColors.lightGrey,
              borderRadius: BorderRadius.only(topRight: Radius.circular(8), bottomRight: Radius.circular(8)),
            ),
            child: const Icon(Icons.person_add, size: 18, color: AppColors.darkGrey),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar({double? width, bool? isTablet}) {
    return Container(
      width: width,
      height: 40,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.lightGrey),
      ),
      child: TextField(
        textAlignVertical: TextAlignVertical.center,
        decoration: InputDecoration(
          hintText: 'Search for a stock, future, option or index',
          hintStyle: TextStyle(color: AppColors.greyText, fontSize: 13),
          prefixIcon: Icon(Icons.search, color: AppColors.greyText, size: (isTablet ?? false) ? 16 : 18),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 0),
          isDense: true,
        ),
      ),
    );
  }

  Widget _buildMobileSearchBar() {
    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.lightGrey),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      child: const TextField(
        textAlignVertical: TextAlignVertical.center,
        decoration: InputDecoration(
          hintText: 'Search stocks, futures, options...',
          hintStyle: TextStyle(color: AppColors.greyText, fontSize: 14),
          prefixIcon: Icon(Icons.search, color: AppColors.greyText, size: 20),
          suffixIcon: Icon(Icons.mic, color: AppColors.greyText, size: 18),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 0),
          isDense: true,
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isTablet) {
    return Container(
      height: 32,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: AppColors.filterChipBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: AppTextStyles.bodySmall.copyWith(color: AppColors.primaryBlue, fontWeight: FontWeight.w500)),
          const SizedBox(width: 6),
          Icon(Icons.close, size: isTablet ? 12 : 14, color: AppColors.primaryBlue),
        ],
      ),
    );
  }

  Widget _buildMobileFilterChip(String label) {
    return Container(
      height: 28,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.filterChipBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: AppColors.primaryBlue), overflow: TextOverflow.ellipsis, maxLines: 1),
          const SizedBox(width: 4),
          const Icon(Icons.close, size: 10, color: AppColors.primaryBlue),
        ],
      ),
    );
  }

  Widget _buildCancelAllButton(bool isTablet) {
    return Container(
      height: 40,
      child: ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.cancelButtonRed,
          foregroundColor: AppColors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cancel_outlined, size: isTablet ? 14 : 16),
            const SizedBox(width: 6),
            Text('Cancel all', style: TextStyle(fontSize: isTablet ? 12 : 13, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildMobileCancelButton() {
    return Container(
      width: 60,
      height: 28,
      decoration: BoxDecoration(
        color: AppColors.cancelButtonRed,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [BoxShadow(color: AppColors.cancelButtonRed.withValues(alpha: 0.3), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(8),
          onTap: () {},
          child: const Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.close, size: 12, color: AppColors.white),
                SizedBox(width: 4),
                Text('Cancel', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.white)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOrdersTable(BuildContext context, bool isMobile, bool isTablet) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.lightGrey),
      ),
      child: isMobile 
          ? _buildMobileTableContent()
          : Column(
              children: [
                _buildDesktopTableHeader(isTablet),
                Expanded(child: _buildDesktopTableContent(isTablet)),
              ],
            ),
    );
  }

  Widget _buildDesktopTableHeader(bool isTablet) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: const BoxDecoration(
        color: AppColors.backgroundColor,
        borderRadius: BorderRadius.only(topLeft: Radius.circular(8), topRight: Radius.circular(8)),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Row(
            children: [
              _buildTableHeader('Time', flex: 1, iconType: 'time', isTablet: isTablet),
              if (constraints.maxWidth > (isTablet ? 700 : 800)) // More tablet-friendly breakpoint
                _buildTableHeader('Client', flex: 1, iconType: 'sort', isTablet: isTablet),
              _buildTableHeader('Ticker', flex: 2, isTablet: isTablet),
              _buildTableHeader('Side', flex: 1, iconType: 'side', isTablet: isTablet),
              if (constraints.maxWidth > (isTablet ? 900 : 1000)) // More tablet-friendly breakpoint
                _buildTableHeader('Product', flex: 1, iconType: 'product', isTablet: isTablet),
              _buildTableHeader('Qty', flex: constraints.maxWidth > (isTablet ? 900 : 1000) ? 2 : 1, iconType: 'sort', isTablet: isTablet),
              _buildTableHeader('Price', flex: 1, iconType: 'sort', isTablet: isTablet),
              _buildTableHeader('Actions', flex: 1, isTablet: isTablet),
            ],
          );
        },
      ),
    );
  }

  Widget _buildTableHeader(String title, {int flex = 1, String iconType = 'none', bool? isTablet}) {
    return Expanded(
      flex: flex,
      child: Container(
        padding: const EdgeInsets.only(right: 16),
        decoration: const BoxDecoration(
          border: Border(right: BorderSide(color: AppColors.lightGrey, width: 0.1)),
        ),
        child: LayoutBuilder(
          builder: (context, constraints) {
            // Responsive icon sizing based on available width and device type
            double iconSize;
            if (isTablet == true) {
              iconSize = constraints.maxWidth < 80 ? 10 : 12;
            } else {
              iconSize = constraints.maxWidth < 80 ? 12 : 14;
            }
            
            return Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                // Actions column gets left margin only for desktop
                title == 'Actions' 
                  ? Container(
                      margin: EdgeInsets.only(left: constraints.maxWidth > 100 ? 40 : 20),
                      child: Text(title, style: AppTextStyles.tableHeader, overflow: TextOverflow.ellipsis),
                    )
                  : Text(title, style: AppTextStyles.tableHeader, overflow: TextOverflow.ellipsis),
                
                // Icons AFTER text - responsive sizing
                if (iconType != 'none' && constraints.maxWidth > (isTablet == true ? 50 : 60)) ...[
                  const SizedBox(width: 4),
                  if (iconType == 'time')
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.keyboard_arrow_up, size: iconSize, color: AppColors.greyText),
                        const SizedBox(width: 2),
                        Icon(Icons.filter_alt, size: iconSize, color: AppColors.greyText),
                      ],
                    )
                  else if (iconType == 'side')
                    Icon(Icons.filter_alt, size: iconSize, color: AppColors.greyText)
                  else if (iconType == 'product')
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.keyboard_arrow_up, size: iconSize, color: AppColors.greyText),
                        const SizedBox(width: 2),
                        Icon(Icons.filter_alt, size: iconSize, color: AppColors.greyText),
                      ],
                    )
                  else if (iconType == 'sort')
                    Icon(Icons.keyboard_arrow_up, size: iconSize, color: AppColors.greyText),
                ],
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildDesktopTableContent(bool isTablet) {
    return ListView.builder(
      itemCount: widget.orders.length,
      itemBuilder: (context, index) {
        final order = widget.orders[index];
        return _buildDesktopTableRow(order, isTablet);
      },
    );
  }

  Widget _buildDesktopTableRow(OrderModel order, bool isTablet) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.lightGrey, width: 0.5)),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Row(
            children: [
              _buildTableCell(order.time, flex: 1),
              if (constraints.maxWidth > (isTablet ? 700 : 800)) // More tablet-friendly breakpoint
                _buildTableCell(order.client, flex: 1),
              _buildTableCellWithInfo(order.ticker, order.hasInfo, flex: 2, isTablet: isTablet),
              _buildTableCell(order.side, flex: 1),
              if (constraints.maxWidth > (isTablet ? 900 : 1000)) // More tablet-friendly breakpoint
                _buildTableCell(order.product, flex: 1),
              _buildTableCell(order.quantity, flex: constraints.maxWidth > (isTablet ? 900 : 1000) ? 2 : 1),
              _buildTableCell(order.price, flex: 1),
              Expanded(
                flex: 1,
                child: Container(
                  margin: const EdgeInsets.only(left: 40), // Actions margin for alignment
                  child: Center(
                    child: IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.more_horiz, color: AppColors.greyText, size: isTablet ? 16 : 18),
                      constraints: const BoxConstraints(),
                      padding: const EdgeInsets.all(4),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildTableCell(String text, {int flex = 1}) {
    return Expanded(
      flex: flex,
      child: Container(
        padding: const EdgeInsets.only(right: 16),
        decoration: const BoxDecoration(
          border: Border(right: BorderSide(color: AppColors.lightGrey, width: 0.5)),
        ),
        child: Text(text, style: AppTextStyles.tableCell, overflow: TextOverflow.ellipsis, maxLines: 1),
      ),
    );
  }

  Widget _buildTableCellWithInfo(String text, bool hasInfo, {int flex = 1, bool? isTablet}) {
    return Expanded(
      flex: flex,
      child: Container(
        padding: const EdgeInsets.only(right: 16),
        decoration: const BoxDecoration(
          border: Border(right: BorderSide(color: AppColors.lightGrey, width: 0.5)),
        ),
        child: Row(
          children: [
            Expanded(child: Text(text, style: AppTextStyles.tableCell, overflow: TextOverflow.ellipsis, maxLines: 1)),
            if (hasInfo) ...[
              const SizedBox(width: 4),
              Icon(Icons.info_outline, size: (isTablet == true) ? 12 : 14, color: AppColors.primaryBlue),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMobileTableContent() {
    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: widget.orders.length,
      itemBuilder: (context, index) {
        final order = widget.orders[index];
        return _buildMobileOrderCard(order);
      },
    );
  }

  Widget _buildMobileOrderCard(OrderModel order) {
    final bool isBuy = order.side.toLowerCase() == 'buy';
    final Color sideColor = isBuy ? AppColors.greenPositive : AppColors.redNegative;
    
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.lightGrey),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Expanded(
                      child: Text(order.ticker, style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600, fontSize: 16), overflow: TextOverflow.ellipsis),
                    ),
                    if (order.hasInfo) ...[
                      const SizedBox(width: 4),
                      const Icon(Icons.info_outline, size: 16, color: AppColors.primaryBlue),
                    ],
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: sideColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                child: Text(order.side, style: AppTextStyles.bodySmall.copyWith(color: sideColor, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildMobileInfoItem('Time', order.time)),
              Expanded(child: _buildMobileInfoItem('Client', order.client)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _buildMobileInfoItem('Product', order.product)),
              Expanded(child: _buildMobileInfoItem('Qty', order.quantity)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMobileInfoItem('Price', order.price),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.more_horiz, color: AppColors.greyText),
                constraints: const BoxConstraints(),
                padding: const EdgeInsets.all(4),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMobileInfoItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyles.bodySmall.copyWith(color: AppColors.greyText, fontSize: 11)),
        const SizedBox(height: 2),
        Text(value, style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w500), overflow: TextOverflow.ellipsis),
      ],
    );
  }

  Widget _buildPagination(BuildContext context, bool isMobile, bool isTablet) {
    if (isMobile) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: TextButton.icon(
              onPressed: () {},
              style: TextButton.styleFrom(foregroundColor: AppColors.greyText, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
              icon: Icon(Icons.chevron_left, size: isTablet ? 16 : 18),
              label: const Text('Previous', style: AppTextStyles.bodyMedium),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(color: AppColors.primaryBlue, borderRadius: BorderRadius.circular(6)),
            child: Text('1 / 1', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.white, fontWeight: FontWeight.w500)),
          ),
          Expanded(
            child: TextButton.icon(
              onPressed: () {},
              style: TextButton.styleFrom(foregroundColor: AppColors.greyText, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
              icon: Icon(Icons.chevron_right, size: isTablet ? 16 : 18),
              label: const Text('Next', style: AppTextStyles.bodyMedium),
            ),
          ),
        ],
      );
    } else {
      return Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(border: Border.all(color: AppColors.lightGrey), borderRadius: BorderRadius.circular(4)),
            child: const Text('Previous', style: AppTextStyles.bodyMedium),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: const Text('Page 1', style: AppTextStyles.bodyMedium),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(border: Border.all(color: AppColors.lightGrey), borderRadius: BorderRadius.circular(4)),
            child: const Text('Next', style: AppTextStyles.bodyMedium),
          ),
        ],
      );
    }
  }

  Widget _buildTabletDrawer() {
    return SizedBox(
      width: 320,
      child: Drawer(
        backgroundColor: AppColors.white,
        child: SafeArea(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(color: AppColors.primaryBlue, border: Border(bottom: BorderSide(color: AppColors.lightGrey))),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(color: AppColors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(25)),
                      child: const Center(child: Text('LK', style: TextStyle(color: AppColors.white, fontSize: 18, fontWeight: FontWeight.w600))),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Lalit Kumar', style: TextStyle(color: AppColors.white, fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Text('Account: AAA002', style: TextStyle(color: AppColors.white.withValues(alpha: 0.8), fontSize: 14)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  children: [
                    _buildDrawerItem(icon: Icons.dashboard_outlined, title: 'Dashboard', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.trending_up, title: 'Market Watch', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.swap_horiz, title: 'Exchange Files', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.account_balance_wallet, title: 'Portfolio', onTap: () => Navigator.pop(context), hasSubmenu: true),
                    _buildDrawerItem(icon: Icons.account_balance, title: 'Funds', onTap: () => Navigator.pop(context), hasSubmenu: true),
                    _buildDrawerItem(icon: Icons.list_alt, title: 'Orders', onTap: () => Navigator.pop(context), isSelected: true),
                    _buildDrawerItem(icon: Icons.history, title: 'Trade History', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.analytics_outlined, title: 'Reports', onTap: () => Navigator.pop(context)),
                    const Divider(color: AppColors.lightGrey, height: 24),
                    _buildDrawerItem(icon: Icons.settings_outlined, title: 'Settings', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.help_outline, title: 'Help & Support', onTap: () => Navigator.pop(context)),
                    _buildDrawerItem(icon: Icons.logout, title: 'Logout', onTap: () => Navigator.pop(context), isLogout: true),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(20),
                child: const Text('Version 1.0.0', style: TextStyle(color: AppColors.greyText, fontSize: 12)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMobileDrawer() {
    return Drawer(
      backgroundColor: AppColors.white,
      child: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(color: AppColors.primaryBlue, border: Border(bottom: BorderSide(color: AppColors.lightGrey))),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: AppColors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Center(child: Text('LK', style: TextStyle(color: AppColors.white, fontSize: 16, fontWeight: FontWeight.w600))),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Lalit Kumar', style: TextStyle(color: AppColors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                        Text('Account: AAA002', style: TextStyle(color: AppColors.white.withValues(alpha: 0.8), fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _buildDrawerItem(icon: Icons.dashboard_outlined, title: 'Dashboard', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.trending_up, title: 'Market Watch', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.swap_horiz, title: 'Exchange Files', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.account_balance_wallet, title: 'Portfolio', onTap: () => Navigator.pop(context), hasSubmenu: true),
                  _buildDrawerItem(icon: Icons.account_balance, title: 'Funds', onTap: () => Navigator.pop(context), hasSubmenu: true),
                  _buildDrawerItem(icon: Icons.list_alt, title: 'Orders', onTap: () => Navigator.pop(context), isSelected: true),
                  _buildDrawerItem(icon: Icons.history, title: 'Trade History', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.analytics_outlined, title: 'Reports', onTap: () => Navigator.pop(context)),
                  const Divider(color: AppColors.lightGrey),
                  _buildDrawerItem(icon: Icons.settings_outlined, title: 'Settings', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.help_outline, title: 'Help & Support', onTap: () => Navigator.pop(context)),
                  _buildDrawerItem(icon: Icons.logout, title: 'Logout', onTap: () => Navigator.pop(context), isLogout: true),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              child: const Text('Version 1.0.0', style: TextStyle(color: AppColors.greyText, fontSize: 12)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool hasSubmenu = false,
    bool isSelected = false,
    bool isLogout = false,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.1) : null,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        leading: Icon(icon, color: isLogout ? AppColors.redNegative : isSelected ? AppColors.primaryBlue : AppColors.darkGrey, size: 20),
        title: Text(title, style: TextStyle(color: isLogout ? AppColors.redNegative : isSelected ? AppColors.primaryBlue : AppColors.darkGrey, fontSize: 14, fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500)),
        trailing: hasSubmenu ? const Icon(Icons.keyboard_arrow_right, color: AppColors.greyText, size: 18) : null,
        onTap: onTap,
        dense: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }
}