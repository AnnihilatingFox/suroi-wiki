import { FireMode } from "@/vendor/suroi/common/src/constants";
import {
  GunDefinition,
  Guns,
} from "@/vendor/suroi/common/src/definitions/guns";
import InfoboxRow from "./utils/InfoboxRow";
import InfoboxColumn from "./utils/InfoboxColumn";
import AmmoIcon from "../icons/AmmoIcon";
import InfoboxHeader from "./utils/InfoboxHeader";
import { ExplosionDefinition } from "@/vendor/suroi/common/src/definitions/explosions";
import GenericSidebar from "./utils/GenericSidebar";
import InfoboxAudio from "./utils/InfoboxAudio";
import InfoboxAudioGroup from "./utils/InfoboxAudioGroup";
import InfoboxSection from "./utils/InfoboxSection";
import { Unpacked, WithRequired } from "@/lib/ts/utility";
import {
  ItemDefinition,
  WearerAttributes,
} from "@/vendor/suroi/common/src/utils/objectDefinitions";
import {
  getSuroiImageLink,
  getSuroiItem,
  getSuroiKillfeedImageLink,
} from "@/lib/util/suroi";
import Image from "next/image";
import Link from "../links/Link";

export default function GunSidebar({ gun, explosion }: GunSidebarProps) {
  return (
    <GenericSidebar title={gun.name} image={getSuroiImageLink(gun)}>
      <InfoboxRow>
        <InfoboxColumn title="World Image">
          <div className="flex items-center">
            <Image
              width={128}
              height={128}
              alt={`World image of ${gun.name}`}
              src={getSuroiImageLink(
                gun.isDual ? getSuroiItem(gun.singleVariant)! : gun,
                undefined,
                "world"
              )}
            />
          </div>
        </InfoboxColumn>
        <InfoboxColumn title="Killfeed Icon">
          <Image
            width={128}
            height={128}
            alt={`Killfeed icon of ${gun.name}`}
            src={getSuroiKillfeedImageLink(gun)}
          />
        </InfoboxColumn>
      </InfoboxRow>
      <InfoboxRow>
        <InfoboxColumn title="Fire Mode">
          {FireMode[gun.fireMode]}
        </InfoboxColumn>
        <InfoboxColumn title="Ammo Type">
          <AmmoIcon ammo={gun.ammoType} scale={0.5} />
        </InfoboxColumn>
        <InfoboxColumn title="Capacity">{gun.capacity}</InfoboxColumn>
      </InfoboxRow>
      <InfoboxRow>
        <InfoboxColumn title="Reload">
          {gun.singleReload ? "1" : gun.capacity} in {gun.reloadTime}s
        </InfoboxColumn>
        <InfoboxColumn title="Firing Delay" abbr="Delay between shots">
          {gun.fireDelay}ms
        </InfoboxColumn>
        <InfoboxColumn
          title="Switch Delay"
          abbr="Cooldown between switching between this weapon and another"
        >
          {gun.switchDelay}ms
        </InfoboxColumn>
      </InfoboxRow>

      <InfoboxRow>
        <InfoboxColumn
          title="Spread"
          abbr="Spread (angle of inaccuracy) when still"
        >
          {gun.shotSpread}°
        </InfoboxColumn>
        {gun.isDual && (
          <InfoboxColumn title="Single Variant">
            <Link href={`/weapons/guns/${gun.singleVariant}`}>
              {getSuroiItem(gun.singleVariant)?.name}
            </Link>
          </InfoboxColumn>
        )}
        {[Guns.find((g) => g.idString === `dual_${gun.idString}`)].filter(Boolean).map(
          (gun) => (
            <InfoboxColumn title="Dual Variant" key={gun?.idString}>
              <Link href={`/weapons/guns/dual_${gun?.idString}`}>
                {gun?.name}
              </Link>
            </InfoboxColumn>
          )
        )}
        <InfoboxColumn
          title="Move Spread"
          abbr="Spread (angle of inaccuracy when moving)"
        >
          {gun.moveSpread}°{" "}
          <abbr title="When compared to normal spread">
            ({gun.moveSpread - gun.shotSpread > 0 ? "+" : ""}
            {(gun.moveSpread - gun.shotSpread).toFixed(2)}°)
          </abbr>
        </InfoboxColumn>
      </InfoboxRow>
      <InfoboxHeader>Ballistics</InfoboxHeader>
      <InfoboxRow>
        <InfoboxColumn title="Damage">{gun.ballistics.damage}</InfoboxColumn>
        <InfoboxColumn title="Bullet Speed">
          {gun.ballistics.speed}
        </InfoboxColumn>
        <InfoboxColumn title="Range">{gun.ballistics.range}</InfoboxColumn>
      </InfoboxRow>

      <InfoboxRow>
        <InfoboxColumn title="Obstacle Damage">
          x{gun.ballistics.obstacleMultiplier}
        </InfoboxColumn>
        <InfoboxColumn
          title="Max. DPS"
          abbr="Hypothetical maximum damage per second (DPS)"
        >
          {gun.fireMode === FireMode.Burst &&
            (
              (1000 /
                (gun.burstProperties.burstCooldown +
                  gun.fireDelay * gun.burstProperties.shotsPerBurst)) *
              (gun.ballistics.damage * gun.burstProperties.shotsPerBurst)
            ).toFixed(2)}
          {gun.fireMode !== FireMode.Burst &&
            (
              gun.ballistics.damage *
              (gun.bulletCount ?? 1) *
              (1000 / gun.fireDelay)
            ).toFixed(2)}
        </InfoboxColumn>
        <InfoboxColumn
          title="Max. Obstacle DPS"
          abbr="Hypothetical maximum damage per second (DPS) on obstacles"
        >
          {gun.fireMode === FireMode.Burst &&
            (
              (1000 /
                (gun.burstProperties.burstCooldown +
                  gun.fireDelay * gun.burstProperties.shotsPerBurst)) *
              (gun.ballistics.damage *
                gun.ballistics.obstacleMultiplier *
                gun.burstProperties.shotsPerBurst)
            ).toFixed(2)}
          {gun.fireMode !== FireMode.Burst &&
            (
              gun.ballistics.damage *
              gun.ballistics.obstacleMultiplier *
              (gun.bulletCount ?? 1) *
              (1000 / gun.fireDelay)
            ).toFixed(2)}
        </InfoboxColumn>
      </InfoboxRow>

      {gun.bulletCount && (
        <>
          <InfoboxHeader>Shotgun Stats</InfoboxHeader>
          <InfoboxRow>
            <InfoboxColumn title="Bullet Count" abbr="Bullets fired per shot">
              {gun.bulletCount}
            </InfoboxColumn>
            <InfoboxColumn title="Jitter Radius" abbr="Random bullet offset">
              {gun.jitterRadius ?? "None"}
            </InfoboxColumn>
            <InfoboxColumn
              title="Total Damage"
              abbr="Total damage per shot (bullets x damage per bullet)"
            >
              {gun.bulletCount * gun.ballistics.damage}
            </InfoboxColumn>
          </InfoboxRow>
        </>
      )}

      {/* fixme: Gun attributes */}
      {/* {gun.wearerAttributes && (
        <>
          <InfoboxHeader>Wearer Attributes</InfoboxHeader>
          {gun.wearerAttributes.passive && (
            <InfoboxSection
              title="Passive"
              abbr="Attributes applied when the item is in the user's inventory"
             
            >
              <InfoboxColumn
                title="Max. adren"
                abbr="The maximum adrenaline a player can have"
              >
                {gun.wearerAttributes.passive.maxAdrenaline !== undefined
                  ? `x${gun.wearerAttributes.passive.maxAdrenaline}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Max. health"
                abbr="The maximum health a player can have"
              >
                {gun.wearerAttributes.passive.maxHealth !== undefined
                  ? `x${gun.wearerAttributes.passive.maxHealth}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Min. adren"
                abbr="The minimum adrenaline a player can have"
              >
                {gun.wearerAttributes.passive.minAdrenaline !== undefined
                  ? `x${gun.wearerAttributes.passive.minAdrenaline}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Speed boost"
                abbr="A speed modifier multiplying the current speed"
              >
                {gun.wearerAttributes.passive.speedBoost !== undefined
                  ? `x${gun.wearerAttributes.passive.speedBoost}`
                  : "None"}
              </InfoboxColumn>
            </InfoboxSection>
          )}
          {gun.wearerAttributes.active && (
            <InfoboxSection
              title="Active"
              abbr="Attributes applied when the item is active"
             
            >
              <InfoboxColumn
                title="Max. adren"
                abbr="The maximum adrenaline a player can have"
              >
                {gun.wearerAttributes.active.maxAdrenaline !== undefined
                  ? `x${gun.wearerAttributes.active.maxAdrenaline}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Max. health"
                abbr="The maximum health a player can have"
              >
                {gun.wearerAttributes.active.maxHealth !== undefined
                  ? `x${gun.wearerAttributes.active.maxHealth}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Min. adren"
                abbr="The minimum adrenaline a player can have"
              >
                {gun.wearerAttributes.active.minAdrenaline !== undefined
                  ? `x${gun.wearerAttributes.active.minAdrenaline}`
                  : "None"}
              </InfoboxColumn>
              <InfoboxColumn
                title="Speed boost"
                abbr="A speed modifier multiplying the current speed"
              >
                {gun.wearerAttributes.active.speedBoost !== undefined
                  ? `x${gun.wearerAttributes.active.speedBoost}`
                  : "None"}
              </InfoboxColumn>
            </InfoboxSection>
          )}
          {gun.wearerAttributes.on && (
            <InfoboxSection
              title="Conditional"
              abbr="Attributes applied when a condition is met"
             
            >
              {(gun.wearerAttributes.on.kill?.length ?? 0) > 0 && (
                <InfoboxSection
                  title="On Kill"
                  abbr="Attributes applied every time this weapon kills another player"
                 
                >
                  {gun.wearerAttributes.on.kill!.map((v) => (
                    <>
                      {v.maxAdrenaline !== undefined && (
                        <InfoboxColumn
                          title="Max. adren"
                          abbr="The maximum adrenaline a player can have"
                        >
                          x{v.maxAdrenaline}
                        </InfoboxColumn>
                      )}
                      {v.maxHealth !== undefined && (
                        <InfoboxColumn
                          title="Max. health"
                          abbr="The maximum health a player can have"
                        >
                          x{v.maxHealth}
                        </InfoboxColumn>
                      )}
                      {v.minAdrenaline !== undefined && (
                        <InfoboxColumn
                          title="Min. adren"
                          abbr="The minimum adrenaline a player can have"
                        >
                          +{v.minAdrenaline}
                        </InfoboxColumn>
                      )}
                      {v.speedBoost !== undefined && (
                        <InfoboxColumn
                          title="Speed boost"
                          abbr="A speed modifier multiplying the current speed"
                        >
                          x{v.speedBoost}
                        </InfoboxColumn>
                      )}
                      {v.adrenalineRestored !== undefined && (
                        <InfoboxColumn
                          title="Adren. restored"
                          abbr="The amount of adrenaline gained when this action happens"
                        >
                          +{v.adrenalineRestored}
                        </InfoboxColumn>
                      )}
                      {v.healthRestored !== undefined && (
                        <InfoboxColumn
                          title="Health restored"
                          abbr="The amount of health gained when this action occurs"
                        >
                          +{v.healthRestored}
                        </InfoboxColumn>
                      )}
                      <InfoboxColumn
                        title="Limit"
                        abbr="How many times this effect can stack"
                      >
                        {v.limit ?? "Infinite"}
                      </InfoboxColumn>
                    </>
                  ))}
                </InfoboxSection>
              )}
              {(gun.wearerAttributes.on.damageDealt?.length ?? 0) > 0 && (
                <InfoboxSection
                  title="On Damage Dealt"
                  abbr="Attributes applied every time this weapon inflicts damage to another player"
                 
                >
                  {gun.wearerAttributes.on.damageDealt!.map((v) => (
                    <>
                      {v.maxAdrenaline !== undefined && (
                        <InfoboxColumn
                          title="Max. adren"
                          abbr="The maximum adrenaline a player can have"
                        >
                          x{v.maxAdrenaline}
                        </InfoboxColumn>
                      )}
                      {v.maxHealth !== undefined && (
                        <InfoboxColumn
                          title="Max. health"
                          abbr="The maximum health a player can have"
                        >
                          x{v.maxHealth}
                        </InfoboxColumn>
                      )}
                      {v.minAdrenaline !== undefined && (
                        <InfoboxColumn
                          title="Min. adren"
                          abbr="The minimum adrenaline a player can have"
                        >
                          +{v.minAdrenaline}
                        </InfoboxColumn>
                      )}
                      {v.speedBoost !== undefined && (
                        <InfoboxColumn
                          title="Speed boost"
                          abbr="A speed modifier multiplying the current speed"
                        >
                          x{v.speedBoost}
                        </InfoboxColumn>
                      )}
                      {v.adrenalineRestored !== undefined && (
                        <InfoboxColumn
                          title="Adren. restored"
                          abbr="The amount of adrenaline gained when this action happens"
                        >
                          +{v.adrenalineRestored}
                        </InfoboxColumn>
                      )}
                      {v.healthRestored !== undefined && (
                        <InfoboxColumn
                          title="Health restored"
                          abbr="The amount of health gained when this action occurs"
                        >
                          +{v.healthRestored}
                        </InfoboxColumn>
                      )}
                      <InfoboxColumn
                        title="Limit"
                        abbr="How many times this effect can stack"
                      >
                        {v.limit ?? "Infinite"}
                      </InfoboxColumn>
                    </>
                  ))}
                </InfoboxSection>
              )}
            </InfoboxSection>
          )}
        </>
      )} */}

      {gun.wearerAttributes && <Effects gun={gun as any} />}

      {explosion && (
        <>
          <InfoboxHeader>Explosion Ballistics</InfoboxHeader>
          <InfoboxRow>
            <InfoboxColumn title="Explosion Damage">
              {explosion.damage}
            </InfoboxColumn>
            <InfoboxColumn title="Explosion Obstacle Damage">
              x{explosion.obstacleMultiplier}
            </InfoboxColumn>
            <InfoboxColumn title="Explosion Radius">
              Min: {explosion.radius.min} Max: {explosion.radius.max}
            </InfoboxColumn>
          </InfoboxRow>
          <InfoboxRow>
            <InfoboxColumn title="Shrapnel Count">
              {explosion.shrapnelCount}
            </InfoboxColumn>
            <InfoboxColumn title="Shrapnel Damage">
              {explosion.ballistics.damage}
            </InfoboxColumn>
            <InfoboxColumn title="Shrapnel Speed">
              {explosion.ballistics.speed}
            </InfoboxColumn>
          </InfoboxRow>
          <InfoboxRow>
            <InfoboxColumn title="Shrapnel Range">
              {explosion.ballistics.range}
            </InfoboxColumn>
            <InfoboxColumn title="Shrapnel Obstacle Damage">
              x{explosion.ballistics.obstacleMultiplier}
            </InfoboxColumn>
            <InfoboxColumn
              title="Shrapnel Total Damage"
              abbr="Damage of all shrapnel pieces"
            >
              {explosion.shrapnelCount * explosion.ballistics.damage}
            </InfoboxColumn>
          </InfoboxRow>
        </>
      )}

      <InfoboxAudioGroup>
        <InfoboxAudio
          name="Fire"
          src={`https://github.com/HasangerGames/suroi/raw/master/client/public/audio/sfx/weapons/${gun.idString}_fire.mp3`}
        />
        <InfoboxAudio
          name="Switch"
          src={`https://github.com/HasangerGames/suroi/raw/master/client/public/audio/sfx/weapons/${gun.idString}_switch.mp3`}
        />
        <InfoboxAudio
          name="Reload"
          src={`https://github.com/HasangerGames/suroi/raw/master/client/public/audio/sfx/weapons/${gun.idString}_reload.mp3`}
        />
        {explosion && (
          <InfoboxAudio
            name="Explosion"
            // HACK: hardcoded because USAS is the only explosive gun atm
            src={`https://github.com/HasangerGames/suroi/raw/master/client/public/audio/sfx/${explosion.idString}.mp3`}
          />
        )}
      </InfoboxAudioGroup>

      <InfoboxHeader>Advanced Stats</InfoboxHeader>
      <InfoboxRow>
        <InfoboxColumn title="Internal ID">
          <span className="font-mono">{gun.idString}</span>
        </InfoboxColumn>
      </InfoboxRow>
    </GenericSidebar>
  );
}

export interface GunSidebarProps {
  gun: GunDefinition;
  explosion?: ExplosionDefinition;
}

function Effects({
  gun,
}: {
  gun: WithRequired<GunDefinition, "wearerAttributes">;
}) {
  return (
    <>
      <InfoboxSection title="Effects">
        {gun.wearerAttributes.passive && (
          <InfoboxSection title="Passive">
            <Attributes attributes={gun.wearerAttributes.passive} />
          </InfoboxSection>
        )}
        {gun.wearerAttributes.on && (
          <InfoboxSection title="Conditional">
            {gun.wearerAttributes.on.kill && (
              <>
                {gun.wearerAttributes.on.kill.map((attr) => (
                  <Attributes attributes={attr} key={attr.healthRestored} />
                ))}
              </>
            )}
          </InfoboxSection>
        )}
      </InfoboxSection>
    </>
  );
}

function Attributes({
  attributes,
}: {
  attributes:
    | WearerAttributes
    | NonNullable<
        Unpacked<
          WithRequired<
            WithRequired<
              ItemDefinition,
              "wearerAttributes"
            >["wearerAttributes"],
            "on"
          >["on"]["kill"]
        >
      >;
}) {
  return (
    <>
      <InfoboxRow>
        <InfoboxColumn title="Health Multiplier">
          {attributes.maxHealth ?? "None"}
        </InfoboxColumn>
        <InfoboxColumn title="Adrenaline Multiplier">
          {attributes.maxAdrenaline ?? "None"}
        </InfoboxColumn>
      </InfoboxRow>
      <InfoboxRow>
        <InfoboxColumn title="Min. Adrenaline">
          {attributes.minAdrenaline ?? "Unchanged"}
        </InfoboxColumn>
        <InfoboxColumn title="Speed Multipler">
          {attributes.speedBoost ?? "None"}
        </InfoboxColumn>
      </InfoboxRow>
      {"limit" in attributes && (
        <InfoboxRow>
          <InfoboxColumn
            title="Health Restored"
            abbr="Health restored when this condition is met"
          >
            {attributes.healthRestored ?? "None"}
          </InfoboxColumn>
        </InfoboxRow>
      )}
    </>
  );
}
