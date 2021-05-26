<template>
  <v-card class="mx-auto my-3 border pa-3" max-width="200">
    <v-img class="white--text yellow align-end" height="100px" :src="img">
    </v-img>
    <v-card-title>{{ title }}</v-card-title>
    

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