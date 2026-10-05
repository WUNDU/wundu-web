import Image from "next/image";
import { MapPin, Pencil, Phone } from "lucide-react";
import { BirthdayCakeIcon, CalendarUserIcon } from "@/constants/icons";
import { avatar } from "@/constants/images";
import type { ProfileDTO } from "../mock/profile";

type ProfileCardProps = {
  profile: ProfileDTO;
  createdLabel: string;
  onEdit?: () => void;
};

function ProfileCard({ profile, createdLabel, onEdit }: ProfileCardProps) {
  const infoFields = [
    { label: "NASCIMENTO", value: profile.birthDate, Icon: BirthdayCakeIcon },
    { label: "TELEFONE", value: profile.phone, Icon: Phone },
    { label: "ENDEREÇO", value: profile.address, Icon: MapPin },
    { label: "CONTA CRIADA", value: createdLabel, Icon: CalendarUserIcon },
  ];

  return (
    <section
      aria-labelledby="profile-title"
      className="flex flex-col gap-4 self-stretch border-0 bg-transparent lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-(--card-barras) lg:bg-(--bg-card) lg:flex-row"
    >
      <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch rounded-tl-2xl rounded-bl-2xl border-l-[12px] border-l-(--border-blue) bg-(--bg-card) p-7 lg:w-96 lg:rounded-none">
        <Image
          src={profile.photo ?? avatar}
          alt="Foto de perfil"
          width={120}
          height={120}
          className="size-28 rounded-3xl object-cover outline-[2.5px] outline-offset-[-2.5px] outline-(--border-blue)"
        />
        <div className="flex flex-col items-start justify-start self-stretch">
          <h2
            id="profile-title"
            className="self-stretch font-manrope text-xl font-bold leading-8 text-(--text-title)"
          >
            {profile.name}
          </h2>
          <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description-60)">
            {profile.email}
          </p>
        </div>
        <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
          Este é o perfil responsável pelas conquistas e preferências desta
          conta.
        </p>
      </div>

      <span
        aria-hidden="true"
        className="hidden h-px w-full bg-(--card-barras) lg:block lg:h-auto lg:w-px"
      />

      <div className="flex flex-1 flex-col items-start justify-start gap-4 self-stretch rounded-2xl border border-(--card-barras) bg-(--bg-card) p-4 lg:gap-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-8 lg:py-7">
        <div className="flex items-center justify-between self-stretch">
          <h3 className="flex-1 font-manrope text-base font-bold text-(--text-title) lg:text-lg">
            Informações da conta
          </h3>
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 items-center justify-center gap-2 rounded-xl border-[1.5px] border-(--button-border) bg-transparent px-4 transition-all duration-200 hover:bg-primary-300/10 active:scale-[0.98] lg:h-10 lg:border-(--button-icon-blue) lg:px-5"
          >
            <Pencil
              width={20}
              height={20}
              aria-hidden="true"
              className="hidden text-(--button-icon-blue) lg:block"
            />
            <span className="text-center font-manrope text-xs font-medium leading-5 text-(--button-icon-blue) lg:text-sm">
              Editar perfil
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 self-stretch md:grid-cols-2">
          {infoFields.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-start justify-start gap-1.5 border-b border-(--card-barras) pb-3"
            >
              <div className="flex items-center justify-start gap-2.5 self-stretch">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-300/10"
                >
                  <Icon width={16} height={16} className="text-primary-300" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
                  <p className="self-stretch px-3 font-manrope text-sm font-bold leading-5 text-(--text-description-60)">
                    {label}
                  </p>
                  <span className="flex self-stretch bg-transparent px-3.5 py-4 lg:contents">
                    <p className="min-w-0 flex-1 truncate font-manrope text-base font-normal text-(--text-title)">
                      {value}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
