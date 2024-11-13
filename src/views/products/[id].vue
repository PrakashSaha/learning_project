<script setup lang="ts">
import Modal from '@/components/ui/modal.vue';
import FileUploader from '@/components/FileUplodaer.vue';
import { useObjectUrl } from '@vueuse/core';

import productModal from '@/composable/useProductModal';
const { isOpen, onClose } = productModal();
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { useGlobalLoader } from 'vue-global-loader';
const { displayLoader, destroyLoader } = useGlobalLoader();
type PAYLOAD = {
  name: string;
  price: number;
  stock: number;
  mainImage: File | undefined;
  subImages: File[] | undefined;
  description: string;
  category: string | undefined;
};
const form = ref<PAYLOAD>({
  name: 'Product',
  price: 10,
  stock: 10,
  mainImage: undefined,
  subImages: undefined,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos accusamus tenetur saepe expedita nisi, dolorum doloremque eligendi. Alias, dolorem perferendis?',
  category: undefined,
});
import { useCategoryStore } from '@/stores/category';
const categoryStore = useCategoryStore();
import { useProductStore } from '@/stores/productStore';
const productStore = useProductStore();
const categories = computed(() => categoryStore.categoriesData.categories);
const mainImagePreview = ref<string[]>([]);
const subImagesPreview = ref<string[]>([]);
const onMainImageDrop = (files: File[] | null) => {
  form.value.mainImage = files && files.length > 0 ? files[0] : undefined;
  if (files && files.length) {

    files.forEach((file, index) => {
      if (index === 0) {
        const url = useObjectUrl(file);
        if (url.value) {

          mainImagePreview.value = []
          mainImagePreview.value.push(url.value);
        }
      }
    });
  }
};
const onMainImageChange = (files: FileList | null) => {
  form.value.mainImage = files && files.length > 0 ? files[0] : undefined;
  if (files && files.length) {
    
    Array.from(files).forEach((file, index) => {
      if (index === 0) {
        const url = useObjectUrl(file);
        if (url.value) {
          mainImagePreview.value = []

          mainImagePreview.value.push(url.value);
        }
      }
    });
  }
};
const onSubImageDrop = (files: File[] | null) => {
  form.value.subImages = files && files.length > 0 ? files : undefined;
  if (files && files.length) {
    files.forEach((file, index) => {
      const url = useObjectUrl(file);
      if (url.value) {
        subImagesPreview.value.push(url.value);
      }
    });
  }
};
const onSubImageChange = (files: FileList | null) => {
  form.value.subImages = files && files.length > 0 ? Array.from(files) : undefined;
  if (files && files.length) {
    Array.from(files).forEach((file, index) => {
      const url = useObjectUrl(file);
      if (url.value) {
        subImagesPreview.value.push(url.value);
      }
    });
  }
};

const route = useRoute();
const onSubmit = async () => {
  try {
    displayLoader();
    await productStore.editProduct(route.params.id.toString() ,form.value);
    onClose();
  } catch (error) {
    console.log(error);
  } finally {
    destroyLoader();
  }
};

const fetchProduct = async () => {
  try {
    displayLoader();
    const product = await productStore.getProduct(route.params.id.toString());
    console.log("product error handeling:",product); 
    if(product){
      form.value.name = product.name;
      form.value.price = product.price;
      form.value.stock = product.stock;
      form.value.description = product.description;
      form.value.category = product.category;
      mainImagePreview.value.push(product.mainImage.url);
      subImagesPreview.value = product.subImages.map((img) => img.url);

    }
  } catch (error) {
    console.log(error);
  } finally {
    destroyLoader();
  }
};
onMounted(async () => {
  await fetchProduct();
});
</script>

<template>
    <div class="mx-auto w-ful max-w-4xl my-10">
        <form @submit.prevent="onSubmit" action="" class="grid gap-y-4">
            <div class="grid pt-3 gap-2">
              <Label for="name">Product name</Label>
              <Input
                id="name"
                type="text"
                placeholder="name"
                v-model="form.name"
              />
            </div> 
            <div class="grid pt-3 gap-2">
              <Label for="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="price"
                v-model="form.price"
              />
            </div>
            <div class="grid pt-3 gap-2">
              <Label for="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="stock"
                v-model="form.stock"
              />   
            </div>
            <div class="grid pt-3 gap-2">
                <Label for="mImage">Main Image</Label>
                <template ></template>
                <div class="grid grid-cols-2 gap-x-2 flex-wrap">
                    <FileUploader 
                    @on-change= "onMainImageChange" 
                    @on-drop= "onMainImageDrop" 
                    :multiple = "false"
                    />
                     <img 
                         v-for="img in mainImagePreview"
                         :src="img" :key="img"
                         class="h-40 w-auto object-cover border"
                     />
                </div>
            </div><div class="grid pt-3 gap-2">
                <Label for="mImage">Sub Images</Label>
                <template></template>
                <div class="grid grid-cols-2 gap-x-2 flex-wrap">
                    <FileUploader 
                    @on-change= "onSubImageChange" 
                    @on-drop= "onSubImageDrop" 
                    :multiple = "true"
                    />
                     <img v-for="img in subImagePreview" :src="img" class="h-40 w-auto object-cover border" :key="img"/>
                </div>
            </div>
            
            <div class="grid pt-3 gap-2">
              <Label for="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="description"
                v-model="form.description"
              />
            </div>
            <div class="grid pt-3 gap-2">
              <Label for="category">Category</Label>
                <Select v-model="form.category" id="category">
                    <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem 
                            v-for="category in categories" 
                            :value="category._id">
                                {{ category.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button class="w-full" type="submit"> Create Product</Button>
        </form>
    </div>
    
</template>



<style lang="scss" scoped>

</style>