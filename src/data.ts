export type Role = "waiter" | "cook" | "bartender" | "admin";

export type TableItem = {
  id: number;
  waiter: string;
  guests: number;
  status: string;
};

export type OrderItem = {
  id: string;
  table: string;
  details: string;
  priority?: "normal" | "high";
  eta: string;
};

export type DrinkItem = {
  id: string;
  station: string;
  note: string;
  pickup: string;
};

export const roleLabels: Record<Role, string> = {
    waiter: "Зал",
    cook: "Кухня",
    bartender: "Бар",
    admin: "Админ"
};

export const routeByRole: Record<Role, string> = {
    waiter: "/hall",
    cook: "/kitchen",
    bartender: "/bar",
    admin: "/admin"
};

export const tables: TableItem[] = [
  { id: 1, waiter: "Алина", guests: 4, status: "Гости на месте" },
  { id: 2, waiter: "Самир", guests: 2, status: "Ожидают заказ" },
  { id: 3, waiter: "Лейла", guests: 6, status: "Подача блюд" },
  { id: 4, waiter: "Мурад", guests: 3, status: "Счёт запрошен" },
  { id: 5, waiter: "Нигяр", guests: 2, status: "Бронь 18:30" },
  { id: 6, waiter: "Рауф", guests: 5, status: "Ожидают напитки" }
];

export const kitchenOrders: OrderItem[] = [
  { id: "Заказ 1", table: "Стол 1", details: "Паста, цезарь, лимонад", priority: "high", eta: "4 мин" },
  { id: "Заказ 2", table: "Стол 2", details: "Стейк medium, картофель", eta: "8 мин" },
  { id: "Заказ 3", table: "Стол 3", details: "Суп дня, хлебная корзина", eta: "5 мин" },
  { id: "Заказ 4", table: "Стол 6", details: "Бургер, соус BBQ, чай", eta: "9 мин" }
];

export const barOrders: DrinkItem[] = [
  { id: "Напиток 1", station: "Барная станция A", note: "2 мохито, 1 кола", pickup: "Стол 1" },
  { id: "Напиток 2", station: "Барная станция B", note: "Латте, американо, чай", pickup: "Стол 4" },
  { id: "Напиток 3", station: "Барная станция C", note: "Фреш апельсин, вода", pickup: "Стол 2" },
  { id: "Напиток 4", station: "Барная станция D", note: "Коктейль дня, тоник", pickup: "Стол 6" }
];

export const adminMenu = [
  "Tables",
  "Menu",
  "Waiters"
];
