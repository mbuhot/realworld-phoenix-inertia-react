defmodule ConduitWeb.AuthPlug do
  use ConduitWeb, :verified_routes

  def init(mode) when is_atom(mode) do
    [mode: mode]
  end

  def init(opts) when is_list(opts) do
    [mode, to] = opts
    [mode: mode, to: to]
  end

  def call(conn, opts) do
    current_user = conn.assigns[:current_user]
    conn = assign_user_token(conn, current_user)

    case Keyword.get(opts, :mode, :user_required) do
      :user_required ->
        if !current_user,
          do:
            conn
            |> Phoenix.Controller.redirect(to: Keyword.get(opts, :to, ~p"/sign-in"))
            |> Plug.Conn.halt(),
          else: conn |> assign_user_prop()

      :user_optional ->
        if current_user,
          do: conn |> assign_user_prop(),
          else: Plug.Conn.assign(conn, :current_user, nil)

      :no_user ->
        if(current_user,
          do:
            conn
            |> assign_user_prop()
            |> Phoenix.Controller.redirect(to: Keyword.get(opts, :to, ~p"/"))
            |> Plug.Conn.halt(),
          else: conn
        )
    end
  end

  defp assign_user_token(conn, nil), do: conn

  defp assign_user_token(conn, current_user) do
    token = Phoenix.Token.sign(conn, "user socket", current_user.id)
    Plug.Conn.assign(conn, :user_token, token)
  end

  defp assign_user_prop(conn) do
    conn
    |> Inertia.Controller.assign_prop(
      :user,
      Map.take(conn.assigns.current_user, [:id, :first_name, :last_name])
    )
  end
end
