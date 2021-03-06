<template>
  <v-app >
    <v-overlay
          :absolute="true"
          :value="no_assignment"
        ></v-overlay>
    <Loading></Loading>
    <form method="post" id="mturk_form" :action="action" ref="form">
      <input type="hidden" name="assignmentId" :value="assignmentId" />
      <input
        type="hidden"
        name="shoppingCart[]"
        v-for="element in shoppingCart"
        :key="element.itemId"
        :value="element.sku"
      />
      <input type="hidden" name="originalNumberOfItems" :value="n" />
      <input
        type="hidden"
        name="numberOfItemsSubmitted"
        :value="shoppingCart.length"
      />
      <input type="hidden" name="category" :value="category.category" />
      <input type="hidden" name="persona" :value="persona.description" />
      <input type="hidden" name="persona_id" :value="persona.persona_id" />
      <input type="hidden" name="timeSpent" :value="timeSpent" />
    </form>
    <v-app-bar app color="primary" dark height="150">
      <v-row>
        <v-col cols="8">
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
              {{ persona.description }}
            </v-alert>
          </transition>
        </v-col>
        <v-col
          >Category: <b>{{ category.category }}</b></v-col
        >
      </v-row>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
    <v-footer app>
      <v-row>
        <v-col class="d-flex flex-column justify-center">
          Add items up to between ${{ category.lb }} and ${{ category.ub }}.
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
              v-if="submittable"
              class="text--white mx-auto"
              :disabled="!priceWithinRange"
              @click="submittingForm"
            >
              <v-progress-circular
                v-if="uploading"
                indeterminate
                color="purple"
              ></v-progress-circular>
              SUBMIT
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { differenceInSeconds } from "date-fns";
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import HelloWorld from "./components/HelloWorld";
import Loading from "@/components/Loading.vue";
import _ from "lodash";
import axios from "axios";
const liveMturk = "https://www.mturk.com/mturk/externalSubmit";
const sandboxMturk = "https://workersandbox.mturk.com/mturk/externalSubmit";
export default {
  name: "App",

  components: {
    HelloWorld,
    Loading,
  },

  data: () => ({
    no_assignment:true,
    startTime: new Date(),
    endTime: null,
    action: null,
    assignmentId: null,
    uploading: false,
    hitId: null,
    workerId: null,
    timeSpent: null,
    submittable: true,
    sandbox: null,
  }),
  computed: {
    ...mapState([
      "category",
      "persona",
      "persona_loaded",
      "n",
      "independent",
      "generation",
      "shoppingCart",
    ]),
    ...mapGetters({
      total: "totalAmount",
      priceWithinRange: "priceWithinRange",
    }),

    skus() {
      return JSON.stringify(this.shoppingCart);
    },
  },
  async created() {
    this.setUrlParams(this.$route.query);
    await this.setParams();
    await this.getData();
  },
  async mounted() {
    const { category, persona_id, sandbox, assignmentId, hitId, workerId, n } =
      this.$route.query;

    this.hitId = hitId;
    this.no_assignment = assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE"
    
    this.workerId = workerId;
    this.assignmentId = assignmentId ;
    this.sandbox = sandbox;
     if (parseInt(this.sandbox) === 1) {
      this.action = sandboxMturk;
    } else {
      this.action = liveMturk;
    }
  },

  methods: {
    ...mapActions(["setParams", "getData"]),
    ...mapMutations({
      setUrlParams: "SET_URL_PARAMS",
      setUploading: "SET_UPLOADING",
    }),
    async submittingForm() {
      this.endTime = new Date();
      this.timeSpent = differenceInSeconds(this.endTime, this.startTime);
      this.submittable = false;
      this.setUploading(true);
      const ddbUrl =
        "https://6we1uwj492.execute-api.us-east-1.amazonaws.com/Prod/newitem";
      await axios.post(ddbUrl, {
        ...this.$route.query,
        assignment: this.assignmentId,
        originalNumberOfItems: this.n,
        numberOfItemsSubmitted: this.shoppingCart.length,
        shoppingCart: _.map(this.shoppingCart, (i) => i.sku),
        hitId: this.hitId,
        workerId: this.workerId,
        category: this.category.category,
        persona: this.persona.description,
        persona_id: this.persona.persona_id,
        timeSpent: this.timeSpent,
        startTime: this.startTime,
        endTime: this.endTime,
        totalAmountInCart: this.total,
        sandbox: this.sandbox,
        independent: this.independent,
        generation:parseInt(this.generation),
        
      });
      this.setUploading(false);
      if (this.independent) {
        location.reload(false);
      } else {
        this.$refs.form.submit();
      }
    },
  },
};
</script>
