<template>
  <v-app>
    <v-app-bar app color="primary" dark height="100">
      <div class="d-flex flex-column">
        <div>
          From the groceries on the screen, pick and drag some to go in the cart today
          for a family of three with a baby and a busy lifestyle that add up to
          between ${{lowerBound}} and ${{upperBound}}.
        </div>
        <div>
          Total amount selected:
          <v-chip  color="red"
      text-color="white">${{ total.toFixed(2) }}</v-chip>
        </div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld @update-total="updateTotal" />
    </v-main>
    <v-footer app padless>
   <v-col
      class="text-center"
      cols="12"
    >
      <v-spacer></v-spacer>
       <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__backInDown animate__slow"
    leave-active-class="animate__animated animate__backOutUp animate__slow"
  >
      <v-btn color='red' class='text--white' v-if='priceWithinRange'>SUBMIT</v-btn>
       </transition>
    </v-col>

  </v-footer >
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    total: 0,
    lowerBound:10,
    upperBound:20,
  }),
  computed:{
      priceWithinRange(){
        
        return (this.lowerBound<=this.total) && (this.total<=this.upperBound);
    }
  },
  methods: {
    updateTotal(e) {
      
      this.total = e;
    },
  
  },
};
</script>
