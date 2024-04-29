<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/attribute-hyphenation -->
<template>
<div>
    <!-- Header -->
    <header>
        <DefaultHeader></DefaultHeader>
    </header>

    <main>
        <div>
            <a-layout id="components-layout-demo-top-side-2">
                <a-layout>
                    <a-layout-sider style="background:#17212b;height: 100vh;overflow: auto;" collapsible :collapsed="isCollapsed" @collapse="onCollapse">
                        <a-table v-if="!isCollapsed" :data-source="dataSource" :columns="columns" />
                    </a-layout-sider>
                    <a-layout style="padding: 0 24px 24px">

                        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '100%' }">
                            <div id="google">

                            </div>
                        </a-layout-content>
                    </a-layout>
                </a-layout>
            </a-layout>
            <nuxt></nuxt>
        </div>
    </main>

    <!-- Footer -->
    <footer>Footer</footer>
</div>
</template>

<script>
import {
    ref
} from 'vue';
import DefaultHeader from '../components/Header/DefaultHeader.vue';

export default {
    components: {
        DefaultHeader,
    },
    setup() {
        const isCollapsed = ref(false);
        const onCollapse = (value) => {
            isCollapsed.value = value;
        };
        const dataSource = [{
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
            },
            {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
            },
        ];

        const columns = [{
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                customRender: (text) => ({
                    attrs: {
                        style: 'color: white;' // Màu chữ đỏ cho cột Name
                    },
                    children: text
                })
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                customRender: (text) => ({
                    attrs: {
                        style: 'color: white;' // Màu chữ đỏ cho cột Name
                    },
                    children: text
                })
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                customRender: (text) => ({
                    attrs: {
                        style: 'color: white;' // Màu chữ đỏ cho cột Name
                    },
                    children: text
                })
            },
        ];
        return {
            isCollapsed,
            onCollapse,
            dataSource,
            columns
        };
    },

    data() {
        return {
            collapsed: false,
        };
    },

};
</script>

<style>
#components-layout-demo-top-side-2 .logo {
    background: rgba(255, 255, 255, .2);
    margin: 16px 28px 16px 0;
    float: left;
}

html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
}

#app>div {
    height: 100%;
}
</style>
