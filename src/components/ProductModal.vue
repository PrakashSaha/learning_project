<script setup lang="ts">
import Modal from '@/components/ui/modal.vue';
import FileUploader from '@/components/FileUplodaer.vue';
import productModal from '@/composable/useProductModal';
const {isOpen, onClose} = productModal();
import {ref, computed} from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useGlobalLoader } from 'vue-global-loader';
const { displayLoader, destroyLoader } = useGlobalLoader();

import {useCategoryStore} from '@/stores/category';
import {useProductStore} from '@/stores/productStore';
import { useObjectUrl } from '@vueuse/core';
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const categories = computed(() => categoryStore.categoriesData.categories);
type PAYLOAD = {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string | undefined;
    mainImage: File | undefined;
    subImages: File[] | undefined;
};
const form = ref<PAYLOAD>({
    name: 'Product',
    description: 'lorum ipsum is ajnjdbfjkad vvkjbibojnas v badi vb j bj bsijd bkjb jksb',
    price: 10,
    stock: 10,
    category: undefined,           
    mainImage: undefined,
    subImages: undefined
});

const mainImagePreview = ref<string[]>([]);
const subImagePreview = ref<string[]>([]);
const onMainImageDrop = (files: File[] | null) => {
    form.value.mainImage = files && files.length > 0 ? files[0] : undefined;
    if(files && files.length){
        files.forEach((file, index) =>{
            if(index === 0){
                const url = useObjectUrl(file);
                if(url.value){
                    mainImagePreview.value.push(url.value);
                }
            }
        });
    }
};

const onMainImageChange = (files: FileList | null) => {
    form.value.mainImage = files && files.length > 0 ? files[0] : undefined;
    if(files && files.length){
        Array.from(files).forEach((file, index) =>{
            if(index === 0){
                const url = useObjectUrl(file);
                if(url.value){
                    mainImagePreview.value.push(url.value);
                }
            }
        });
    }
};

const onSubImageDrop = (files: File[] | null) => {
    form.value.subImages = files && files.length > 0 ? files : undefined;
    if(files && files.length){
        files.forEach((file, index) =>{
            const url = useObjectUrl(file);
                if(url.value){
                    subImagePreview.value.push(url.value);
                }
        });
    }
};

const onSubImageChange = (files: FileList | null) => {
    form.value.subImages = files && files.length > 0 ?  Array.from(files) : undefined;
    if(files && files.length){
        Array.from(files).forEach((file, index) =>{
            const url = useObjectUrl(file);
                if(url.value){
                    subImagePreview.value.push(url.value);
                }
        });
    }
}

const onSubmit = async()=>{
    try{
        displayLoader();
        await productStore.createProduct(form.value);
        onClose();
    }catch (error) {
    console.log(error);
    } finally {
        destroyLoader();
    }
}
</script>

<template>
   <Modal isOpen="isOpen" @on-close="onClose">
    <div class="overflow-y-auto h-[500px] max-h-[600px]">
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
                <template v-if="!form.mainImage">
                    <FileUploader 
                    @on-change= "onMainImageChange" 
                    @on-drop= "onMainImageDrop" 
                    :multiple = "false"
                    />
                </template>
                <div class="flex gap-x-2" v-else>
                     <img 
                         v-for="img in mainImagePreview"
                         :src="img"
                         class="h-40 w-auto object-cover border"
                     />
                </div>
            </div>
            <div class="grid pt-3 gap-2">
                <Label for="mImage">Sub Images</Label>
                <div class="grid grid-cols-2 gap-x-2 flex-wrap">
                     <img 
                         v-for="img in subImagePreview" :src="img"
                         class="h-40 w-auto object-cover border"
                     />
                </div>
                
                <FileUploader 
                @on-change= "onSubImageChange" 
                @on-drop= "onSubImageDrop" 
                :multiple = "true"
                />
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
                            <SelectItem v-for="category in categories" :value="category._id">
                                {{ category.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button class="w-full" type="submit"> Create Product</Button>
        </form>
    </div>
    
   </Modal>
</template>

