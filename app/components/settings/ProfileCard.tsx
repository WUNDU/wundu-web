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
      className="flex flex-col self-stretch overflow-hidden rounded-2xl border border-(--card-barras) bg-(--background) lg:flex-row"
    >
      <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch border-l-12 border-l-(--border-blue) bg-(--bg-card) p-7 lg:w-96">
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
        className="h-px w-full bg-(--card-barras) lg:h-auto lg:w-px"
      />

      <div className="flex flex-1 flex-col items-start justify-start gap-5 px-8 py-7">
        <div className="flex items-center justify-between self-stretch">
          <h3 className="flex-1 font-manrope text-lg font-bold text-(--text-title)">
            Informações da conta
          </h3>
          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border-[1.5px] border-(--button-icon-blue) bg-transparent px-5 transition-all duration-200 hover:bg-primary-300/10 active:scale-[0.98]"
          >
            <Pencil
              width={20}
              height={20}
              aria-hidden="true"
              className="text-(--button-icon-blue)"
            />
            <span className="text-center font-manrope text-sm font-medium leading-5 text-(--button-icon-blue)">
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
                  <p className="self-stretch font-manrope text-sm font-bold leading-5 text-(--text-description-60)">
                    {label}
                  </p>
                  <p className="self-stretch truncate font-manrope text-base font-normal text-(--text-title)">
                    {value}
                  </p>
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
