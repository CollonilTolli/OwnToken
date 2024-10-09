"use client";

import { Section, Cell, Image, List } from "@telegram-apps/telegram-ui";

import { Link } from "@/components/Link/Link";
import BalanceWallet from "@/components/BalanceWallet/BalanceWallet";

import tonSvg from "./_assets/ton.svg";

export default function Home() {
  return (
    <List>
      <Section header="Features">
        <Link href="/ton-connect">
          <Cell
            before={
              <Image
                src={tonSvg.src}
                style={{ backgroundColor: "#007AFF" }}
                alt=""
              />
            }
            subtitle="Connect your TON wallet"
          >
            TON Connect
          </Cell>
        </Link>
      </Section>
      <BalanceWallet />
    </List>
  );
}
