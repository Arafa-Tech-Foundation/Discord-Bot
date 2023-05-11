import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { getSkullMessages } from "@/lib";
const ChartJsImage = require("chartjs-to-image");

Date.prototype["getWeek"] = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = (today.getTime() - onejan.getTime() + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};

const groupData = (messages: Array<any>, incFunc: string, incName: string) => {
  const data = {};
  for (const message of messages) {
    const inc = `${incName} ${message.created[incFunc]()}`;
    if (!data[inc]) data[inc] = 0;
    data[inc] += message.amount;
  }
  return data;
};

export default {
  data: new SlashCommandBuilder()
    .setName("hazim_skull_counter")
    .setDescription("View Hazim's skull usage trends over a given time period.")
    .addStringOption((option) =>
      option
        .setName("timeline")
        .setDescription("The timeline to see insights of.")
        .setRequired(true)
        .addChoices(
          { name: "Daily", value: "7d" },
          { name: "Weekly", value: "4w" },
          { name: "Monthly", value: "12m" },
          { name: "All", value: "inf" },
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const tl = interaction.options.getString("timeline");
    const currentDate = new Date();
    const [futureDate, incrementFunc, incrementName] =
      tl === "7d"
        ? [
            new Date(currentDate.setDate(currentDate.getDate() + 7)),
            "getDate",
            "Day",
          ]
        : tl === "4w"
        ? [
            new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
            "getWeek",
            "Week",
          ]
        : tl === "12m"
        ? [
            new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)),
            "getMonth",
            "Month",
          ]
        : tl === "inf"
        ? [new Date(9999, 0, 0), "getFullYear", "Year"]
        : null;

    const messages = await getSkullMessages(futureDate);
    const data = groupData(messages, incrementFunc, incrementName);
    const dataValues = Object.values(data);
    const total = dataValues.reduce(
      (acc: number, x: number) => acc + x,
      0,
    ) as number;
    const average = Math.floor(total / dataValues.length);

    const chart = new ChartJsImage();
    chart.setConfig({
      type: "line",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Skulls",
            data: Object.values(data),
            borderColor: "#FF5F6D",
            backgroundColor: "#fe9aa2",
            borderWidth: 5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
    const url = await chart.getShortUrl();
    const embed = new EmbedBuilder()
      .setImage(url)
      .setTitle("Hazim's Skull Count")
      .setDescription(`Insights over a ${tl} period.`)
      .setColor(0xff5f6d)
      .addFields(
        { name: "Total Skulls:", value: total.toString(), inline: true },
        { name: "Average Skulls:", value: average.toString(), inline: true },
      );
    await interaction.reply({ embeds: [embed] });
  },
};
