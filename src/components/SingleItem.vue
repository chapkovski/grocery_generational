<template>
  <v-card class=" ma-1 border d-flex flex-column" width="150" height='300'>
    <v-img class="white--text yellow align-end mx-1" height="100px" :src="img">
    </v-img>
    <h6 class='mx-1'>{{ title }}</h6>
    

    <v-card-text>
      <div>Ounces: <b>{{ ounces }}</b></div>
      <div>Quantity: <b>{{ quantity }}</b></div>
    </v-card-text>

    <v-card-actions class='my-auto'>
      <v-chip
        >Price: <b>${{ price }}</b></v-chip
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["price", "title", "description", "short_title", "img", "ounces", "quantity"],
  data() {
    return {};
  },
  methods: {},
};
</script>