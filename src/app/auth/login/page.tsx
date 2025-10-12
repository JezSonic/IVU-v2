import Card from "@/components/ui/card";

export default function Login() {
	return (
		<div className={"flex justify-center items-center w-full h-full"}>
			<Card title={"Login"}>
				<form className={"flex flex-col gap-3"}>
					<input type={"email"} placeholder={"Email..."} required/>
					<input type={"email"} placeholder={"Password..."} required/>
				</form>
				<button type={"submit"} color={"primary"}>Login with Google</button>
			</Card>
		</div>
	)
}