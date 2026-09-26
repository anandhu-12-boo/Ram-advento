import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { contact } from "@/lib/site-data";
import { heroPoster } from "@/lib/media";
import { btnPrimary } from "@/lib/ui";
import { submitEnquiry } from "@/lib/tours.functions";

const schema = z.object({
  name: z.string().min(2, "Please tell us your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a reachable phone number"),
  message: z.string().min(10, "A few more details, please"),
});

type FormValues = z.infer<typeof schema>;

const field =
  "mt-2 w-full rounded-sm border border-white/15 bg-ink/60 px-4 py-3 text-sm text-mist outline-none transition-colors placeholder:text-mist/35 focus:border-sand";
const label = "text-[0.66rem] font-semibold tracking-[0.2em] text-mist/60 uppercase";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    document.title = "Contact Ram Adventure | Munnar Jeep Safari Booking";
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      await submitEnquiry(values);
      toast.success("Message noted", {
        description: `Thanks ${values.name}, our Munnar team will call you shortly.`,
      });
      reset();
    } catch (e: any) {
      toast.error(e?.message || "Could not send message right now.");
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="Let's plan your trail"
        text="Tell us your dates and what you want to see. We reply fast — usually within the hour."
        image={heroPoster}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="name">
                Your name
              </label>
              <input id="name" className={field} placeholder="Anand" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className={label} htmlFor="phone">
                Phone / WhatsApp
              </label>
              <input id="phone" className={field} placeholder="+91 …" {...register("phone")} />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className={label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={field}
              placeholder="you@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className={label} htmlFor="message">
              What would you like to do?
            </label>
            <textarea
              id="message"
              rows={6}
              className={field}
              placeholder="Dates, number of guests, routes you have in mind…"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          <button type="submit" className={btnPrimary} disabled={isSubmitting}>
            Send message
          </button>
        </form>

        <aside className="h-max rounded-sm border border-white/10 bg-forest-deep/60 p-7">
          <p className="eyebrow">Reach us directly</p>
          <ul className="mt-6 space-y-5 text-sm text-mist/80">
            <li className="flex items-start gap-3">
              <Phone size={17} className="mt-0.5 text-sand" />
              {contact.phone}
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle size={17} className="mt-0.5 text-sand" />
              WhatsApp {contact.whatsapp}
            </li>
            <li className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 text-sand" />
              {contact.email}
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 text-sand" />
              {contact.address}
            </li>
          </ul>
          <div className="trail-divider my-7" />
          <p className="text-xs text-mist/60">
            Office hours are irrelevant here — someone answers the phone at 3 am for a sunrise run.
          </p>
        </aside>
      </section>
    </SiteShell>
  );
}
