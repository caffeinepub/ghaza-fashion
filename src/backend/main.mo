import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import VarArray "mo:core/VarArray";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    description : Text;
    imageUrls : [Text];
    category : Text;
    sizes : [Text];
    availability : Bool;
    createdAt : Int;
  };

  type OrderItem = {
    productId : Nat;
    productName : Text;
    quantity : Nat;
    price : Nat;
    size : Text;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    items : [OrderItem];
    subtotal : Nat;
    deliveryFee : Nat;
    total : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Int;
  };

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 1;
  var nextOrderId = 1;
  var isInitialized = false;

  let adminPassword = "mshd1981!";
  let deliveryFee = 250;
  let freeDeliveryThreshold = 5999;

  // 4 hours in nanoseconds
  let cancelWindowNs : Int = 4 * 60 * 60 * 1_000_000_000;

  public query ({ caller }) func verifyAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    price : Nat,
    description : Text,
    imageUrls : [Text],
    category : Text,
    sizes : [Text],
    availability : Bool,
  ) : async Nat {
    let product : Product = {
      id = nextProductId;
      name;
      price;
      description;
      imageUrls;
      category;
      sizes;
      availability;
      createdAt = Time.now();
    };
    products.add(nextProductId, product);
    let productId = nextProductId;
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    price : Nat,
    description : Text,
    imageUrls : [Text],
    category : Text,
    sizes : [Text],
    availability : Bool,
  ) : async () {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id;
          name;
          price;
          description;
          imageUrls;
          category;
          sizes;
          availability;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (_) {
        products.remove(id);
      };
    };
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) {
        product;
      };
    };
  };

  public shared ({ caller }) func placeOrder(
    customerName : Text,
    customerPhone : Text,
    customerAddress : Text,
    items : [OrderItem],
    paymentMethod : Text,
  ) : async Nat {
    let subtotal = calculateSubtotal(items);
    let deliveryFeeAmount = if (subtotal >= freeDeliveryThreshold) { 0 } else {
      deliveryFee;
    };
    let total = subtotal + deliveryFeeAmount;

    let order : Order = {
      id = nextOrderId;
      customerName;
      customerPhone;
      customerAddress;
      items;
      subtotal;
      deliveryFee = deliveryFeeAmount;
      total;
      paymentMethod;
      status = "Pending";
      createdAt = Time.now();
    };

    orders.add(nextOrderId, order);
    let orderId = nextOrderId;
    nextOrderId += 1;
    orderId;
  };

  func calculateSubtotal(items : [OrderItem]) : Nat {
    var subtotal = 0;
    for (item in items.values()) {
      subtotal += item.price * item.quantity;
    };
    subtotal;
  };

  public shared ({ caller }) func getOrders(password : Text) : async [Order] {
    if (password != adminPassword) {
      Runtime.trap("Unauthorized access");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    switch (orders.get(id)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        order;
      };
    };
  };

  // Get orders by customer phone number
  public query ({ caller }) func getOrdersByPhone(phone : Text) : async [Order] {
    let filtered = orders.values().filter(func(o : Order) : Bool {
      o.customerPhone == phone;
    });
    filtered.toArray();
  };

  // Cancel an order within 4 hours of placing it (by order ID only)
  public shared ({ caller }) func cancelOrder(orderId : Nat) : async () {
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?existingOrder) {
        let elapsed : Int = Time.now() - existingOrder.createdAt;
        if (elapsed > cancelWindowNs) {
          Runtime.trap("Cancellation window has passed (4 hours)");
        };
        if (existingOrder.status == "Cancelled") {
          Runtime.trap("Order is already cancelled");
        };
        let updatedOrder : Order = {
          id = existingOrder.id;
          customerName = existingOrder.customerName;
          customerPhone = existingOrder.customerPhone;
          customerAddress = existingOrder.customerAddress;
          items = existingOrder.items;
          subtotal = existingOrder.subtotal;
          deliveryFee = existingOrder.deliveryFee;
          total = existingOrder.total;
          paymentMethod = existingOrder.paymentMethod;
          status = "Cancelled";
          createdAt = existingOrder.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(
    orderId : Nat,
    status : Text,
    password : Text,
  ) : async () {
    if (password != adminPassword) {
      Runtime.trap("Unauthorized access");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?existingOrder) {
        let updatedOrder : Order = {
          id = existingOrder.id;
          customerName = existingOrder.customerName;
          customerPhone = existingOrder.customerPhone;
          customerAddress = existingOrder.customerAddress;
          items = existingOrder.items;
          subtotal = existingOrder.subtotal;
          deliveryFee = existingOrder.deliveryFee;
          total = existingOrder.total;
          paymentMethod = existingOrder.paymentMethod;
          status;
          createdAt = existingOrder.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func initialize() : async () {
    if (isInitialized) {
      Runtime.trap("Already initialized");
    };

    let sampleProducts : [Product] = [
      {
        id = 1;
        name = "Embroidered Lawn Dress";
        price = 3499;
        description = "Beautifully embroidered 3-piece lawn dress with chiffon dupatta. Perfect for summer occasions.";
        imageUrls = [
          "https://example.com/images/dress1_1.jpg",
          "https://example.com/images/dress1_2.jpg",
        ];
        category = "Dresses";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
      {
        id = 2;
        name = "Cotton Kurti";
        price = 1599;
        description = "Elegant cotton kurti with digital print. Comfortable and stylish for everyday wear.";
        imageUrls = [
          "https://example.com/images/kurti1_1.jpg",
        ];
        category = "Kurtas";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
      {
        id = 3;
        name = "Formal Silk Gown";
        price = 6999;
        description = "Luxurious silk gown with intricate work. Ideal for formal events and weddings.";
        imageUrls = [
          "https://example.com/images/gown1_1.jpg",
          "https://example.com/images/gown1_2.jpg",
        ];
        category = "Dresses";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
      {
        id = 4;
        name = "Casual Tops (Set of 2)";
        price = 2499;
        description = "Pack of 2 casual tops in vibrant prints. Made from soft jersey fabric.";
        imageUrls = [
          "https://example.com/images/tops1_1.jpg",
          "https://example.com/images/tops1_2.jpg",
        ];
        category = "Tops";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
      {
        id = 5;
        name = "Embroidered Shalwar Kameez";
        price = 4599;
        description = "Traditional shalwar kameez with beautiful embroidery. Comfortable for all seasons.";
        imageUrls = [
          "https://example.com/images/shalwar_kameez1_1.jpg",
        ];
        category = "Three Piece Suit";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
      {
        id = 6;
        name = "Party Wear Maxi Dress";
        price = 5799;
        description = "Stylish maxi dress with sequence work. Perfect for parties and festive occasions.";
        imageUrls = [
          "https://example.com/images/maxi1_1.jpg",
        ];
        category = "Dresses";
        sizes = [];
        availability = true;
        createdAt = Time.now();
      },
    ];

    let productIter = sampleProducts.values();
    for (product in productIter) {
      products.add(product.id, product);
    };

    nextProductId := 7;
    isInitialized := true;
  };

  public query ({ caller }) func isInitializedQuery() : async Bool {
    isInitialized;
  };

  public query ({ caller }) func getReturnPolicy() : async Text {
    "7-day return policy. Products can be returned within 7 days of delivery if unused and in original packaging. Delivery charges are non-refundable.";
  };

  public query ({ caller }) func getContactInfo() : async Text {
    "For order inquiries, please contact us at:\nPhone: +92-300-1234567\nEmail: support@ghazafashionstore.com\n";
  };
};
