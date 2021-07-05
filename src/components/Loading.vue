<template>
  <v-dialog
      v-model="uploading"
      
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
  export default {
    data () {
      return {
        dialog: true,
      }
    },
    computed:{...mapState(['uploading'])}
  }
</script>
