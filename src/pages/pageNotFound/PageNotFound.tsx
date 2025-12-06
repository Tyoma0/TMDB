import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./PageNotFound.module.css";

export function PageNotFound() {
    return (
        <section className={styles.wrapper}>
            <div className={styles.content}>
                <h1 className={styles.code}>404</h1>
                <p className={styles.text}>Страница не найдена</p>
                <p className={styles.subText}>Похоже, вы оказались не там... 😕</p>

                <Button
                    variant="contained"
                    component={Link}
                    to="/"
                    className={styles.button}
                >
                    Вернуться на главную
                </Button>
            </div>
        </section>
    );
}
