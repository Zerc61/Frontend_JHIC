import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  });

  const currentUmkmId = computed(() => {
    if (items.value.length === 0) return null;
    return items.value[0].umkm_id;
  });

  function addItem(product) {
    const existing = items.value.find((i) => i.id === product.id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        return { success: false, message: "Stok tidak mencukupi" };
      }
      existing.quantity++;
    } else {
      if (
        items.value.length > 0 &&
        items.value[0].umkm_id !== product.umkm_id
      ) {
        items.value = [];
      }
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        unit: product.unit,
        umkm_id: product.umkm_id,
        umkm_name: product.umkm_name,
      });
    }
    return { success: true, message: "Ditambahkan ke keranjang" };
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id);
  }

  function updateQuantity(id, qty) {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      if (qty <= 0) {
        removeItem(id);
      } else if (qty > item.stock) {
        item.quantity = item.stock;
      } else {
        item.quantity = qty;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    totalItems,
    totalPrice,
    currentUmkmId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
