<template>
  <v-card class=" ma-1 border" max-width="150">
    <v-img class="white--text yellow align-end mx-1" height="100px" :src="img">
    </v-img>
    <h6 class='mx-1'>{{ title }}</h6>
    

    <v-card-text class="text--primary">
      <div>{{ description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-chip
        >Price: <b>${{ price }}</b></v-chip
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["price", "title", "description", "short_title", "img"],
  data() {
    return {};
  },
  methods: {},
};
</script>