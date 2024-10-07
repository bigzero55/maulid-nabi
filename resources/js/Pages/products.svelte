<script>
  import axios from "axios";

  export let products = [];
  let newProduct = { name: "", description: "", price: 0, stock: 0 };
  let showModal = false;

  function addProduct() {
    axios
      .post("/products", newProduct)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  }

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6 text-gray-800">Products</h1>

  <div class="mb-8 bg-white shadow-lg rounded-lg overflow-hidden">
    {#each products as product}
      <div
        class="grid grid-cols-4 gap-4 py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
      >
        <span class="font-semibold text-gray-700">{product.name}</span>
        <span class="text-gray-600">{product.description}</span>
        <span class="text-green-600 font-medium"
          >${product.price.toFixed(2)}</span
        >
        <span class="text-blue-600">Stock: {product.stock}</span>
      </div>
    {/each}
  </div>

  <button
    on:click={openModal}
    class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    Add New Product
  </button>
</div>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    on:click={closeModal}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      on:click|stopPropagation
    >
      <div class="mt-3 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
        <form on:submit|preventDefault={addProduct} class="space-y-4">
          <div>
            <label
              for="productName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Product Name</label
            >
            <input
              id="productName"
              type="text"
              bind:value={newProduct.name}
              placeholder="Product Name"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="productDescription"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              id="productDescription"
              bind:value={newProduct.description}
              placeholder="Description"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              for="productPrice"
              class="block text-sm font-medium text-gray-700 mb-1">Price</label
            >
            <input
              id="productPrice"
              type="number"
              bind:value={newProduct.price}
              placeholder="Price"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="productStock"
              class="block text-sm font-medium text-gray-700 mb-1">Stock</label
            >
            <input
              id="productStock"
              type="number"
              bind:value={newProduct.stock}
              placeholder="Stock"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
            >Add Product</button
          >
        </form>
        <button
          on:click={closeModal}
          class="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >Cancel</button
        >
      </div>
    </div>
  </div>
{/if}
