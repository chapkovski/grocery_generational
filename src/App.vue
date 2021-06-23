<template>
  <v-app>
    <form method="post" id="mturk_form" :action="action" ref="form">
      <input type="hidden" name="assignmentId" :value="assignmentId" />
      <input type="hidden" name="shoppingCart[]" v-for='element in shoppingCart'  :key='element' :value='element' />
    </form>
    <v-app-bar app color="primary" dark height="150">
      <div class="d-flex flex-column">
        <div>
          From the groceries on the screen, pick and drag some to go in a
          shopping cart for:
          <transition
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__tada "
          >
            <v-alert
              border="left"
              color="red lighten"
              class="my-3"
              v-if="persona_loaded"
            >
              {{ persona }}
            </v-alert>
          </transition>
        </div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld @update-total="updateTotal" @change-cart="updCart" />
    </v-main>
    <v-footer app>
      <v-row>
        <v-col class="d-flex flex-column justify-center">
          Add items up to between ${{ lowerBound }} and ${{ upperBound }}.
        </v-col>
        <v-col class="d-flex flex-column justify-center">
          <div>
            Total price of selected items:
            <v-chip color="red" text-color="white"
              >${{ total.toFixed(2) }}</v-chip
            >
          </div>
        </v-col>
        <v-spacer></v-spacer>

        <v-col class="d-flex justify-content-right flex-grow-0">
          <div class="mx-auto">
            <v-btn
              color="red"
              class="text--white mx-auto"
              :disabled="!priceWithinRange"
              @click="submittingForm"
            >
              SUBMIT
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import _ from "lodash";
import axios from "axios";
const liveMturk = "https://www.mturk.com/mturk/externalSubmit";
const sandboxMturk = "https://workersandbox.mturk.com/mturk/externalSubmit";
export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    total: 0,
    lowerBound: 10,
    upperBound: 20,
    persona: null,
    persona_loaded: false,
    persona_id: null,
    action: null,
    assignmentId: null,
    shoppingCart:[]
  }),
  computed: {
    priceWithinRange() {
      return this.lowerBound <= this.total && this.total <= this.upperBound;
    },
    skus(){
      return JSON.stringify(this.shoppingCart);
    }
  },
  async mounted() {
    const { category, persona_id, sandbox, assignmentId } = this.$route.query;

    this.assignmentId = assignmentId || "ASSIGNMENT_ID_NOT_AVAILABLE";

    if (sandbox) {
      this.action = sandboxMturk;
    } else {
      this.action = liveMturk;
    }
    const personaUrl =
      "https://blocke-channels-bucket.s3.amazonaws.com/persona.json";
    const limitsUrl =
      "https://blocke-channels-bucket.s3.amazonaws.com/cats.json";

    this.persona_id = parseInt(persona_id);
    const r = await axios.get(limitsUrl);

    ({ lb: this.lowerBound, ub: this.upperBound } = _.find(r.data, {
      category: category,
    }));
    const personaData = await axios.get(personaUrl);

    this.persona = _.find(personaData.data, {
      persona_id: this.persona_id,
    }).description;
    this.persona_loaded = true;
  },

  methods: {
    updateTotal(e) {
      this.total = e;
    },
    updCart(e) {
      this.shoppingCart=e;
    },
    async submittingForm() {
      const ddbUrl='https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/newitem'
      await axios.post(ddbUrl,{assignment:this.assignmentId, shoppingCart:this.shoppingCart})
      this.$refs.form.submit();
    },
  },
};
</script>
